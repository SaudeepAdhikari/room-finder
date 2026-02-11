const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }
    next();
};

// GET /api/transactions/:transactionId - Get transaction details by ID
router.get('/:transactionId', isAuthenticated, async (req, res) => {
    try {
        const { transactionId } = req.params;
        const userId = req.session.userId;

        const transaction = await Transaction.findOne({ transactionId })
            .populate('booking')
            .populate('tenant', 'firstName lastName email phone avatar')
            .populate('landlord', 'firstName lastName email phone avatar')
            .populate('room', 'title location price images imageUrl');

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Authorization: Only tenant or landlord can view the transaction
        const isTenant = transaction.tenant._id.toString() === userId;
        const isLandlord = transaction.landlord._id.toString() === userId;

        if (!isTenant && !isLandlord) {
            return res.status(403).json({ error: 'Forbidden. You do not have access to this transaction.' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Failed to fetch transaction details' });
    }
});

// GET /api/transactions/booking/:bookingId - Get transaction by booking ID
router.get('/booking/:bookingId', isAuthenticated, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.session.userId;

        // First verify the user has access to this booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const isTenant = booking.tenant.toString() === userId;
        const isLandlord = booking.landlord.toString() === userId;

        if (!isTenant && !isLandlord) {
            return res.status(403).json({ error: 'Forbidden. You do not have access to this booking.' });
        }

        // Find the transaction
        const transaction = await Transaction.findOne({ booking: bookingId })
            .populate('booking')
            .populate('tenant', 'firstName lastName email phone avatar')
            .populate('landlord', 'firstName lastName email phone avatar')
            .populate('room', 'title location price images imageUrl');

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found for this booking' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Error fetching transaction by booking:', error);
        res.status(500).json({ error: 'Failed to fetch transaction details' });
    }
});

// GET /api/transactions/my-transactions - Get all transactions for logged-in user
router.get('/my-transactions', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;

        // Find all transactions where user is either tenant or landlord
        const transactions = await Transaction.find({
            $or: [
                { tenant: userId },
                { landlord: userId }
            ]
        })
            .populate('booking')
            .populate('tenant', 'firstName lastName email phone avatar')
            .populate('landlord', 'firstName lastName email phone avatar')
            .populate('room', 'title location price images imageUrl')
            .sort({ transactionDate: -1 }); // Most recent first

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching user transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

module.exports = router;
