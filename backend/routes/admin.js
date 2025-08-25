const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room');
const AdminSettings = require('../models/AdminSettings');
const bcrypt = require('bcrypt');
const SSE_LOG_ENABLED = process.env.SSE_LOG === 'true';
const rateLimit = require('express-rate-limit');

// Basic rate limiter for login route to mitigate brute force attacks
const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 8, // limit each IP to 8 login requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again later.' }
});

// Admin login
router.post('/login', adminLoginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        req.session.adminId = admin._id;
        // Save session explicitly and also set an explicit cookie to help
        // some browsers/clients recognize the admin session cookie.
        req.session.save((err) => {
            if (err) {
                if (SSE_LOG_ENABLED) console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session creation failed' });
            }

            try {
                const secure = process.env.NODE_ENV === 'production';
                const sameSite = process.env.NODE_ENV === 'production' ? 'none' : 'lax';
                const maxAge = 1000 * 60 * 60 * 24; // 1 day
                // Set a cookie matching the session middleware so clients reliably
                // receive the admin session cookie in responses (helps dev setups).
                res.cookie('admin_sid', req.sessionID, {
                    httpOnly: true,
                    secure,
                    sameSite,
                    path: '/',
                    maxAge
                });
            } catch (e) {
                // non-fatal - don't prevent response
                if (SSE_LOG_ENABLED) console.error('Failed to set admin cookie explicitly:', e);
            }

            res.json({ _id: admin._id, email: admin.email, isAdmin: true });
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Admin logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('admin_sid');
        res.json({ message: 'Logged out' });
    });
});

// Middleware to protect admin routes
function requireAdminAuth(req, res, next) {
    if (!req.session) {
    if (ADMIN_REQ_LOG) console.error('Admin auth failed: No session object');
    return res.status(401).json({ error: 'Admin not authenticated - No session' });
    }
    
    if (!req.session.adminId) {
    if (ADMIN_REQ_LOG) console.error('Admin auth failed: No adminId in session');
    return res.status(401).json({ error: 'Admin not authenticated - Not logged in' });
    }
    next();
}

// Optional request logging for admin routes to aid debugging. Enable by setting
// ADMIN_REQ_LOG=true in your environment. This will print a short line for each
// admin request showing method, path, client ip, sessionID and session.adminId.
const ADMIN_REQ_LOG = process.env.ADMIN_REQ_LOG === 'true';
router.use((req, res, next) => {
    try {
        const sid = req.sessionID || 'no-sessionid';
        const aid = req.session?.adminId || 'no-adminid';
        if (ADMIN_REQ_LOG) {
            console.log(`[ADMINREQ] ${req.method} ${req.originalUrl} ip=${req.ip} sessionID=${sid} adminId=${aid}`);
        }

        // If the request includes a debug header, also persist a short record
        // into Mongo so it can be inspected without having to restart the server
        // or rely on process stdout.
        if (req.headers && String(req.headers['x-admin-debug']) === 'true') {
            try {
                const db = require('mongoose').connection.db;
                const coll = db.collection('adminRequestLogs');
                coll.insertOne({
                    timestamp: new Date(),
                    method: req.method,
                    path: req.originalUrl,
                    ip: req.ip,
                    sessionID: sid,
                    adminId: aid
                }).catch(() => {});
            } catch (e) {
                // ignore DB errors here - logging shouldn't block requests
            }
        }
    } catch (e) {
        // swallow any unexpected logging errors
    }
    next();
});

// Diagnostic endpoint to check authentication status
router.get('/auth-check', async (req, res) => {
    const isAuthenticated = !!(req.session && req.session.adminId);
    
    res.json({
        isAuthenticated,
        sessionExists: !!req.session,
        adminIdExists: !!req.session?.adminId,
        sessionId: req.sessionID,
        timestamp: new Date().toISOString()
    });
});

// Example protected admin route
router.get('/me', requireAdminAuth, async (req, res) => {
    const admin = await User.findById(req.session.adminId);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });
    res.json({
        _id: admin._id,
        avatar: admin.avatar,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        isAdmin: admin.isAdmin
    });
});

// Debug endpoint to check session
router.get('/debug-session', (req, res) => {
    res.json({
        sessionExists: !!req.session,
        sessionId: req.sessionID,
        adminId: req.session?.adminId,
        sessionKeys: req.session ? Object.keys(req.session) : []
    });
});

// Get admin settings
router.get('/settings', requireAdminAuth, async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = new AdminSettings();
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        console.error('Settings fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update admin settings
router.put('/settings', requireAdminAuth, async (req, res) => {
    try {
        let settings = await AdminSettings.findOne();
        if (!settings) {
            settings = new AdminSettings();
        }

        // Update settings with request body
        Object.assign(settings, req.body);
        settings.updatedBy = req.session.adminId;
        settings.updatedAt = new Date();

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Get all users with admin controls
router.get('/users', requireAdminAuth, async (req, res) => {
    try {
        // Check if User model is available
        if (!User) {
            console.error('User model is not defined');
            return res.status(500).json({ error: 'Server configuration error: User model not available' });
        }
        
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching admin users:', error);
        res.status(500).json({ error: 'Failed to fetch users: ' + (error.message || 'Unknown error') });
    }
});

// Ban/Unban user
router.put('/users/:userId/ban', requireAdminAuth, async (req, res) => {
    try {
        const { banned } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { banned },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Get all rooms with admin controls
router.get('/rooms', requireAdminAuth, async (req, res) => {
    try {
        const rooms = await Room.find({}).populate('user', 'email');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
});

// Approve room
router.put('/rooms/:roomId/approve', requireAdminAuth, async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.roomId,
            { status: 'approved' },
            { new: true }
        ).populate('user', 'email');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve room' });
    }
});

// Reject room
router.put('/rooms/:roomId/reject', requireAdminAuth, async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.roomId,
            { status: 'rejected' },
            { new: true }
        ).populate('user', 'email');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject room' });
    }
});

// Delete room
router.delete('/rooms/:roomId', requireAdminAuth, async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
});

// Get dashboard statistics
// Reusable stats builder used by both /stats and streaming endpoint
async function buildAdminStats(timeRange = 'month') {
    const Booking = require('../models/Booking');
    const now = new Date();
    let startDate;
    switch(timeRange) {
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
        default:
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
    }

    const [
        totalUsers,
        totalRooms,
        pendingRooms,
        approvedRooms,
        rejectedRooms,
        bannedUsers,
        totalBookings,
        recentBookings
    ] = await Promise.all([
        User.countDocuments(),
        Room.countDocuments(),
        Room.countDocuments({ status: 'pending' }),
        Room.countDocuments({ status: 'approved' }),
        Room.countDocuments({ status: 'rejected' }),
        User.countDocuments({ banned: true }),
        Booking.countDocuments(),
        Booking.countDocuments({ createdAt: { $gte: startDate } })
    ]);

    const userGroups = await User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: timeRange === 'year' 
                    ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const roomGroups = await Room.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: timeRange === 'year' 
                    ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const bookingGroups = await Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: timeRange === 'year' 
                    ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
                    : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 },
                revenue: { $sum: { $toDouble: '$totalAmount' } }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const userGrowth = userGroups.map(group => ({ date: group._id, count: group.count }));
    const roomGrowth = roomGroups.map(group => ({ date: group._id, count: group.count }));
    const bookingTrends = bookingGroups.map(group => ({ date: group._id, count: group.count, revenue: group.revenue }));

    const totalRevenue = await Booking.aggregate([
        { $group: { _id: null, total: { $sum: { $toDouble: '$totalAmount' } } } }
    ]).then(result => result.length > 0 ? Math.round(result[0].total) : 0);

    const recentRevenue = await Booking.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$totalAmount' } } } }
    ]).then(result => result.length > 0 ? Math.round(result[0].total) : 0);

    const recent7days = await User.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } });
    const recent30days = await User.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } });
    const recentRooms7 = await Room.countDocuments({ createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } });

    return {
        users: { count: totalUsers, recent7: recent7days, recent30: recent30days, banned: bannedUsers },
        rooms: { total: totalRooms, pending: pendingRooms, approved: approvedRooms, rejected: rejectedRooms, recent7: recentRooms7 },
        bookings: { total: totalBookings, recent7: recentBookings },
        revenue: { total: totalRevenue, recent7: recentRevenue },
        userGrowth,
        roomGrowth,
        bookingTrends
    };
}

// GET /stats uses the shared builder
router.get('/stats', requireAdminAuth, async (req, res) => {
    try {
        const { timeRange = 'month' } = req.query;
        const stats = await buildAdminStats(timeRange);
        res.json(stats);
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Server-Sent Events endpoint for live analytics updates
router.get('/analytics/stream', requireAdminAuth, async (req, res) => {
    try {
        const { timeRange = 'month' } = req.query;

    // Set SSE headers and disable proxy buffering where possible
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    // Nginx/other proxies may buffer SSE responses; suggest disabling buffering
    res.setHeader('X-Accel-Buffering', 'no');
    if (res.flushHeaders) res.flushHeaders();

        let closed = false;

    // send initial payload immediately
    const sendUpdate = async () => {
            if (closed) return;
            try {
                const stats = await buildAdminStats(timeRange);
                const payload = JSON.stringify({ stats, timestamp: new Date().toISOString() });
                res.write(`data: ${payload}\n\n`);
                // Try to flush the node response (if available) to push data immediately
                try { if (typeof res.flush === 'function') res.flush(); } catch (e) {}
                if (SSE_LOG_ENABLED) console.log(`[SSE] Sent analytics payload to adminId=${req.session?.adminId} at ${new Date().toISOString()}`);
            } catch (err) {
                console.error('SSE stats error:', err);
            }
        };

    // Log new connection
    if (SSE_LOG_ENABLED) console.log(`[SSE] New analytics stream connection from adminId=${req.session?.adminId} ip=${req.ip} at ${new Date().toISOString()}`);

    // initial send
    await sendUpdate();

        // periodic updates every 10s
        const interval = setInterval(sendUpdate, 10000);

        // Heartbeat to keep connection alive and help prevent buffering (some proxies buffer until a full chunk)
        const heartbeat = setInterval(() => {
            if (closed) return;
            try {
                res.write(': heartbeat\n\n');
                if (typeof res.flush === 'function') res.flush();
            } catch (e) {}
        }, 5000);

        req.on('close', () => {
            closed = true;
            clearInterval(interval);
            clearInterval(heartbeat);
            try { res.end(); } catch (e) {}
        });
    } catch (error) {
        console.error('SSE stream setup failed:', error);
        res.status(500).end();
    }
});

// Get total bookings count
router.get('/bookings/count', requireAdminAuth, async (req, res) => {
    try {
        const Booking = require('../models/Booking');
        const count = await Booking.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings count' });
    }
});

// Get all bookings for admin
router.get('/bookings', requireAdminAuth, async (req, res) => {
    try {
        const Booking = require('../models/Booking');
        const bookings = await Booking.find({})
            .populate('tenant', 'email firstName lastName avatar')
            .populate({
                path: 'room',
                select: 'title price images location'
            })
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Update booking status
router.put('/bookings/:id/status', requireAdminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        
        const Booking = require('../models/Booking');
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
});

// Get all reviews for admin
router.get('/reviews', requireAdminAuth, async (req, res) => {
    try {
        const Review = require('../models/Review');
        const reviews = await Review.find({})
            .populate('user', 'email firstName lastName avatar')
            .populate({
                path: 'room',
                select: 'title price images location'
            })
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Approve a review
router.put('/reviews/:id/approve', requireAdminAuth, async (req, res) => {
    try {
        const Review = require('../models/Review');
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        res.json(review);
    } catch (error) {
        console.error('Error approving review:', error);
        res.status(500).json({ error: 'Failed to approve review' });
    }
});

// Report/flag a review
router.put('/reviews/:id/report', requireAdminAuth, async (req, res) => {
    try {
        const Review = require('../models/Review');
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { reported: true },
            { new: true }
        );
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        res.json(review);
    } catch (error) {
        console.error('Error reporting review:', error);
        res.status(500).json({ error: 'Failed to report review' });
    }
});

// Delete a review
router.delete('/reviews/:id', requireAdminAuth, async (req, res) => {
    try {
        const Review = require('../models/Review');
        const review = await Review.findByIdAndDelete(req.params.id);
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router; 