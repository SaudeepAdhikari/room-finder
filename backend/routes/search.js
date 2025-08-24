const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// Admin middleware
function requireAdminAuth(req, res, next) {
    if (req.session && req.session.adminId) return next();
    res.status(401).json({ error: 'Admin not authenticated' });
}

/**
 * Search autocomplete endpoint for admin dashboard
 * Returns suggestions for rooms, users, and bookings
 */
router.get('/autocomplete', requireAdminAuth, async (req, res) => {
    try {
        const { query, type = 'all', limit = 5 } = req.query;
        
        if (!query || query.length < 2) {
            return res.json({
                rooms: [],
                users: [],
                bookings: []
            });
        }
        
        // Create regex for case-insensitive search
        const searchRegex = new RegExp(query, 'i');
        const numLimit = parseInt(limit);
        
        // Prepare results object
        const results = {};
        
        // Search for rooms if requested
        if (type === 'all' || type === 'rooms') {
            results.rooms = await Room.find({
                $or: [
                    { title: searchRegex },
                    { location: searchRegex },
                    { description: searchRegex }
                ]
            })
            .select('_id title location price imageUrl status createdAt')
            .sort({ createdAt: -1 })
            .limit(numLimit);
        } else {
            results.rooms = [];
        }
        
        // Search for users if requested
        if (type === 'all' || type === 'users') {
            results.users = await User.find({
                $or: [
                    { email: searchRegex },
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { phone: searchRegex }
                ]
            })
            .select('_id email firstName lastName avatar createdAt')
            .sort({ createdAt: -1 })
            .limit(numLimit);
        } else {
            results.users = [];
        }
        
        // Search for bookings if requested
        if (type === 'all' || type === 'bookings') {
            const bookings = await Booking.find({
                $or: [
                    { bookingId: searchRegex },
                    { 'paymentDetails.transactionId': searchRegex }
                ]
            })
            .populate('userId', 'email firstName lastName')
            .populate('roomId', 'title location')
            .select('_id bookingId totalAmount status checkIn checkOut createdAt')
            .sort({ createdAt: -1 })
            .limit(numLimit);
            
            results.bookings = bookings;
        } else {
            results.bookings = [];
        }
        
        res.json(results);
    } catch (error) {
        console.error('Search autocomplete error:', error);
        res.status(500).json({ error: 'Failed to search' });
    }
});

module.exports = router;
