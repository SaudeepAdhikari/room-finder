const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room');
const AdminSettings = require('../models/AdminSettings');
const bcrypt = require('bcrypt');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        req.session.adminId = admin._id;
        // Save session explicitly
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session creation failed' });
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
        console.error('Admin auth failed: No session object');
        return res.status(401).json({ error: 'Admin not authenticated - No session' });
    }
    
    if (!req.session.adminId) {
        console.error('Admin auth failed: No adminId in session');
        return res.status(401).json({ error: 'Admin not authenticated - Not logged in' });
    }
    next();
}

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
router.get('/stats', requireAdminAuth, async (req, res) => {
    try {
        const { timeRange = 'month' } = req.query;
        const Booking = require('../models/Booking');
        
        // Determine date ranges for statistics
        const now = new Date();
        let startDate;
        let dateFormat;
        
        switch(timeRange) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                dateFormat = { day: '2-digit', month: 'short' };
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                dateFormat = { month: 'short', year: '2-digit' };
                break;
            case 'month':
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                dateFormat = { day: '2-digit', month: 'short' };
                break;
        }
        
        // Basic counts
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
        
        // Get user growth data - aggregated by day/week/month based on timeRange
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
        
        // Get room growth data
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
        
        // Get booking trends
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
        
        // Format the growth data for the charts
        const userGrowth = userGroups.map(group => ({
            date: group._id,
            count: group.count
        }));
        
        const roomGrowth = roomGroups.map(group => ({
            date: group._id,
            count: group.count
        }));
        
        const bookingTrends = bookingGroups.map(group => ({
            date: group._id,
            count: group.count,
            revenue: group.revenue
        }));
        
        // Calculate total revenue
        const totalRevenue = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: { $toDouble: '$totalAmount' } }
                }
            }
        ]).then(result => result.length > 0 ? Math.round(result[0].total) : 0);
        
        const recentRevenue = await Booking.aggregate([
            { $match: { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $toDouble: '$totalAmount' } }
                }
            }
        ]).then(result => result.length > 0 ? Math.round(result[0].total) : 0);
        
        // Get counts for recent periods
        const recent7days = await User.countDocuments({ 
            createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        });
        
        const recent30days = await User.countDocuments({
            createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        });
        
        const recentRooms7 = await Room.countDocuments({
            createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        });

        res.json({
            users: {
                count: totalUsers,
                recent7: recent7days,
                recent30: recent30days,
                banned: bannedUsers
            },
            rooms: {
                total: totalRooms,
                pending: pendingRooms,
                approved: approvedRooms,
                rejected: rejectedRooms,
                recent7: recentRooms7
            },
            bookings: {
                total: totalBookings,
                recent7: recentBookings
            },
            revenue: {
                total: totalRevenue,
                recent7: recentRevenue
            },
            userGrowth,
            roomGrowth,
            bookingTrends
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
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