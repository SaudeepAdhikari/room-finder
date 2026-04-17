const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const reviewController = require('../controllers/reviewController');
const { requireAdminAuth } = require('../middleware/authMiddleware');

const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again later.' }
});

const ADMIN_REQ_LOG = process.env.ADMIN_REQ_LOG === 'true';

// Admin Request Logging Middleware
router.use((req, res, next) => {
    try {
        const sid = req.sessionID || 'no-sessionid';
        const aid = req.session?.adminId || 'no-adminid';
        if (ADMIN_REQ_LOG) {
            console.log(`[ADMINREQ] ${req.method} ${req.originalUrl} ip=${req.ip} sessionID=${sid} adminId=${aid}`);
        }
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
                }).catch(() => { });
            } catch (e) {
                // ignore DB errors
            }
        }
    } catch (e) {
        // swallow any unexpected logging errors
    }
    next();
});

// Authentication Routes
router.post('/login', adminLoginLimiter, adminController.login);
router.post('/logout', adminController.logout);
router.get('/auth-check', adminController.authCheck);
router.get('/me', requireAdminAuth, adminController.getMe);
router.put('/me', requireAdminAuth, adminController.updateMe);
router.get('/debug-session', adminController.debugSession);

// User Management Routes
router.get('/users', requireAdminAuth, adminController.getUsers);
router.put('/users/:userId/ban', requireAdminAuth, adminController.toggleBanUser);

// Room Management Routes
router.get('/rooms', requireAdminAuth, adminController.getRooms);
router.put('/rooms/:roomId/approve', requireAdminAuth, adminController.approveRoom);
router.put('/rooms/:roomId/reject', requireAdminAuth, adminController.rejectRoom);
router.delete('/rooms/:roomId', requireAdminAuth, adminController.deleteRoom);

// Transaction Routes
router.get('/transactions', requireAdminAuth, adminController.getTransactions);

// Analytics & Stats Routes
router.get('/stats', requireAdminAuth, adminController.getStats);
router.get('/analytics/stream', requireAdminAuth, adminController.streamAnalytics);
router.get('/analytics/occupancy', requireAdminAuth, adminController.getOccupancyAnalytics);
router.get('/analytics/booking-frequency', requireAdminAuth, adminController.getBookingFrequencyAnalytics);
router.get('/analytics/top-rated', requireAdminAuth, adminController.getTopRatedAnalytics);

// Booking Routes
router.get('/bookings/count', requireAdminAuth, adminController.getBookingsCount);
router.get('/bookings', requireAdminAuth, adminController.getBookings);
router.put('/bookings/:id/status', requireAdminAuth, adminController.updateBookingStatus);

// Review Management Routes
router.get('/reviews', requireAdminAuth, adminController.getReviews);
router.put('/reviews/:id/approve', requireAdminAuth, adminController.approveReview);
router.put('/reviews/:id/report', requireAdminAuth, adminController.reportReview);
router.delete('/reviews/:id', requireAdminAuth, adminController.deleteReview);
router.patch('/reviews/:id', requireAdminAuth, reviewController.updateReviewStatus);

module.exports = router;