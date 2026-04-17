const bcrypt = require('bcrypt');
const User = require('../models/User');
const Room = require('../models/Room');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const adminService = require('../services/adminService');

const SSE_LOG_ENABLED = process.env.SSE_LOG === 'true';
const ADMIN_REQ_LOG = process.env.ADMIN_REQ_LOG === 'true';

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ error: 'Invalid admin credentials' });
        }

        req.session.adminId = admin._id;
        req.session.save((err) => {
            if (err) {
                if (SSE_LOG_ENABLED) console.error('Session save error:', err);
                return res.status(500).json({ error: 'Session creation failed' });
            }

            try {
                const secure = process.env.NODE_ENV === 'production';
                const sameSite = process.env.NODE_ENV === 'production' ? 'none' : 'lax';
                const maxAge = 1000 * 60 * 60 * 24;
                res.cookie('admin_sid', req.sessionID, {
                    httpOnly: true,
                    secure,
                    sameSite,
                    path: '/',
                    maxAge
                });
            } catch (e) {
                if (SSE_LOG_ENABLED) console.error('Failed to set admin cookie explicitly:', e);
            }

            res.json({ _id: admin._id, email: admin.email, isAdmin: true });
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

const logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('admin_sid');
        res.json({ message: 'Logged out' });
    });
};

const authCheck = async (req, res) => {
    const isAuthenticated = !!(req.session && req.session.adminId);
    res.json({
        isAuthenticated,
        sessionExists: !!req.session,
        adminIdExists: !!req.session?.adminId,
        sessionId: req.sessionID,
        timestamp: new Date().toISOString()
    });
};

const getMe = async (req, res) => {
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
};

const updateMe = async (req, res) => {
    try {
        const admin = await User.findById(req.session.adminId);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });

        const { email, phone, currentPassword, newPassword, avatar, firstName, lastName } = req.body;

        if (email !== undefined && email !== admin.email) {
            const exists = await User.findOne({ email });
            if (exists && String(exists._id) !== String(admin._id)) {
                return res.status(409).json({ error: 'Email is already in use by another account.' });
            }
            admin.email = email;
        }

        if (phone !== undefined) admin.phone = phone;
        if (avatar !== undefined) admin.avatar = avatar;
        if (firstName !== undefined) admin.firstName = firstName;
        if (lastName !== undefined) admin.lastName = lastName;

        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ error: 'Current password required to change password.' });
            const match = await bcrypt.compare(currentPassword, admin.password);
            if (!match) return res.status(401).json({ error: 'Current password is incorrect.' });
            admin.password = await bcrypt.hash(newPassword, 10);
        }

        await admin.save();
        res.json({ _id: admin._id, email: admin.email, phone: admin.phone, avatar: admin.avatar, firstName: admin.firstName, lastName: admin.lastName });
    } catch (err) {
        console.error('Admin profile update error:', err && err.message ? err.message : err);
        if (err && err.code === 11000) return res.status(409).json({ error: 'Duplicate field error. Possibly the email is already registered.' });
        if (err && err.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed. Check input fields.' });
        res.status(500).json({ error: 'Failed to update admin profile. Please try again.' });
    }
};

const debugSession = (req, res) => {
    res.json({
        sessionExists: !!req.session,
        sessionId: req.sessionID,
        adminId: req.session?.adminId,
        sessionKeys: req.session ? Object.keys(req.session) : []
    });
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error fetching admin users:', error);
        res.status(500).json({ error: 'Failed to fetch users: ' + (error.message || 'Unknown error') });
    }
};

const toggleBanUser = async (req, res) => {
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
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({}).populate('user', 'email');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rooms' });
    }
};

const approveRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.roomId,
            { status: 'approved' },
            { new: true }
        ).populate('user', 'email');

        if (!room) return res.status(404).json({ error: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve room' });
    }
};

const rejectRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.roomId,
            { status: 'rejected' },
            { new: true }
        ).populate('user', 'email');

        if (!room) return res.status(404).json({ error: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: 'Failed to reject room' });
    }
};

const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.roomId);
        if (!room) return res.status(404).json({ error: 'Room not found' });
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete room' });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({})
            .populate('tenant', 'email firstName lastName phone avatar')
            .populate('landlord', 'email firstName lastName phone avatar')
            .populate('room', 'title location price images imageUrl')
            .populate('booking')
            .sort({ transactionDate: -1 });
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching admin transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

const getStats = async (req, res) => {
    try {
        const { timeRange = 'month' } = req.query;
        const stats = await adminService.buildAdminStats(timeRange);
        res.json(stats);
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

const streamAnalytics = async (req, res) => {
    try {
        const { timeRange = 'month' } = req.query;

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        if (res.flushHeaders) res.flushHeaders();

        let closed = false;

        const sendUpdate = async () => {
            if (closed) return;
            try {
                const stats = await adminService.buildAdminStats(timeRange);
                const payload = JSON.stringify({ stats, timestamp: new Date().toISOString() });
                res.write(`data: ${payload}\n\n`);
                try { if (typeof res.flush === 'function') res.flush(); } catch (e) { }
            } catch (err) {
                console.error('SSE stats error:', err);
            }
        };

        await sendUpdate();
        const interval = setInterval(sendUpdate, 10000);

        const heartbeat = setInterval(() => {
            if (closed) return;
            try {
                res.write(': heartbeat\n\n');
                if (typeof res.flush === 'function') res.flush();
            } catch (e) { }
        }, 5000);

        req.on('close', () => {
            closed = true;
            clearInterval(interval);
            clearInterval(heartbeat);
            try { res.end(); } catch (e) { }
        });
    } catch (error) {
        console.error('SSE stream setup failed:', error);
        res.status(500).end();
    }
};

const getBookingsCount = async (req, res) => {
    try {
        const count = await Booking.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings count' });
    }
};

const getBookings = async (req, res) => {
    try {
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
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.json(booking);
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ error: 'Failed to update booking status' });
    }
};

const getReviews = async (req, res) => {
    try {
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
};

const approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (error) {
        console.error('Error approving review:', error);
        res.status(500).json({ error: 'Failed to approve review' });
    }
};

const reportReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { reported: true },
            { new: true }
        );
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (error) {
        console.error('Error reporting review:', error);
        res.status(500).json({ error: 'Failed to report review' });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
};

const getOccupancyAnalytics = async (req, res) => {
    try {
        const { timeRange = 'month' } = req.query;
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case 'week': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
            case 'year': startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
            default: startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
        }

        const totalRooms = await Room.countDocuments({ status: 'approved' });
        if (totalRooms === 0) return res.json([]);

        const bookingGroups = await Booking.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: 'confirmed' } },
            {
                $group: {
                    _id: timeRange === 'year'
                        ? { $dateToString: { format: '%Y-%m', date: '$createdAt' } }
                        : { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    bookedCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const data = bookingGroups.map(group => ({
            month: group._id,
            occupancyRate: Math.min(100, Math.round((group.bookedCount / totalRooms) * 100))
        }));

        res.json(data);
    } catch (error) {
        console.error('Occupancy analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch occupancy data' });
    }
};

const getBookingFrequencyAnalytics = async (req, res) => {
    try {
        const { timeRange = 'month' } = req.query;
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case 'week': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
            case 'year': startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); break;
            default: startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); break;
        }

        const result = await Booking.aggregate([
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

        const data = result.map(group => ({
            day: group._id,
            bookings: group.count
        }));

        res.json(data);
    } catch (error) {
        console.error('Booking frequency error:', error);
        res.status(500).json({ error: 'Failed to fetch booking frequency' });
    }
};

const getTopRatedAnalytics = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const topRated = await Review.aggregate([
            { $match: { status: 'approved' } },
            {
                $group: {
                    _id: '$room',
                    avgRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            },
            { $sort: { avgRating: -1, reviewCount: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'rooms',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'roomInfo'
                }
            },
            { $unwind: '$roomInfo' },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    title: '$roomInfo.title',
                    location: '$roomInfo.location',
                    rating: '$avgRating',
                    reviewCount: 1
                }
            }
        ]);

        res.json(topRated);
    } catch (error) {
        console.error('Top rated analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch top rated listings' });
    }
};

module.exports = {
    login,
    logout,
    authCheck,
    getMe,
    updateMe,
    debugSession,
    getUsers,
    toggleBanUser,
    getRooms,
    approveRoom,
    rejectRoom,
    deleteRoom,
    getTransactions,
    getStats,
    streamAnalytics,
    getBookingsCount,
    getBookings,
    updateBookingStatus,
    getReviews,
    approveReview,
    reportReview,
    deleteReview,
    getOccupancyAnalytics,
    getBookingFrequencyAnalytics,
    getTopRatedAnalytics
};
