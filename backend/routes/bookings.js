const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const router = express.Router();

// Auth middleware
function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
}

// Create a new booking
router.post('/', requireAuth, async (req, res) => {
    try {
    const { roomId, checkIn, checkOut, message } = req.body;

        // Validate room exists and is available
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.status !== 'approved') {
            return res.status(400).json({ error: 'Room is not available for booking' });
        }

        // Check if dates are valid; support missing checkOut by defaulting to one night
        const checkInDate = new Date(checkIn);
        let checkOutDate = checkOut ? new Date(checkOut) : null;
        const now = new Date();

        if (checkInDate <= now) {
            return res.status(400).json({ error: 'Check-in date must be in the future' });
        }

        // If checkOut not provided or invalid, default to one night after checkIn
        if (!checkOutDate || isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
            checkOutDate = new Date(checkInDate.getTime() + (24 * 60 * 60 * 1000));
        }

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            room: roomId,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    checkIn: { $lt: checkOutDate },
                    checkOut: { $gt: checkInDate }
                }
            ]
        });

        if (conflictingBooking) {
            return res.status(400).json({ error: 'Room is not available for the selected dates' });
        }

        // Calculate total amount (simple calculation - can be enhanced)
        const daysDiff = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalAmount = room.price * daysDiff;

        const booking = new Booking({
            room: roomId,
            tenant: req.session.userId,
            landlord: room.user,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalAmount,
            message: message || ''
        });

        await booking.save();

    // Populate room and user details for response, include images
    await booking.populate('room', 'title location price imageUrl images');
    await booking.populate('tenant', 'firstName lastName email');

        res.status(201).json(booking);
    } catch (err) {
        console.error('Booking creation error:', err);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// Get bookings for the current user (as tenant)
router.get('/my-bookings', requireAuth, async (req, res) => {
    try {
        const bookings = await Booking.find({ tenant: req.session.userId })
            .populate('room', 'title location price imageUrl images')
            .populate('landlord', 'firstName lastName email phone')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get bookings for rooms owned by the current user (as landlord)
router.get('/for-my-rooms', requireAuth, async (req, res) => {
    try {
        // First get all rooms owned by the user
        const myRooms = await Room.find({ user: req.session.userId });
        const roomIds = myRooms.map(room => room._id);

        // Then get all bookings for those rooms
        const bookings = await Booking.find({ room: { $in: roomIds } })
            .populate('room', 'title location price imageUrl images')
            .populate('tenant', 'firstName lastName email phone')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Update booking status (landlord only)
router.put('/:id/status', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if user is the landlord
        if (String(booking.landlord) !== req.session.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        booking.status = status;
        await booking.save();

                // If booking is confirmed, mark the room as booked; if cancelled or completed, free it.
                try {
                    const room = await Room.findById(booking.room);
                    if (room) {
                        if (status === 'confirmed') room.isBooked = true;
                        else if (['cancelled', 'completed'].includes(status)) room.isBooked = false;
                        await room.save();
                    }
                } catch (e) {
                    console.warn('Failed to update room booking flag:', e && e.message);
                }
    await booking.populate('room', 'title location price imageUrl images');
    await booking.populate('tenant', 'firstName lastName email');

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
});

// Cancel booking (tenant only)
router.put('/:id/cancel', requireAuth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if user is the tenant
        if (String(booking.tenant) !== req.session.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Only allow cancellation if booking is still pending or confirmed
        if (!['pending', 'confirmed'].includes(booking.status)) {
            return res.status(400).json({ error: 'Booking cannot be cancelled' });
        }

        booking.status = 'cancelled';
        await booking.save();

                // Free up the room if cancellation happens
                try {
                    const room = await Room.findById(booking.room);
                    if (room) {
                        room.isBooked = false;
                        await room.save();
                    }
                } catch (e) {
                    console.warn('Failed to clear room booking flag on cancel:', e && e.message);
                }

                await booking.populate('room', 'title location price imageUrl images');
    await booking.populate('tenant', 'firstName lastName email');

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
});

// Get booking details
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('room', 'title location price imageUrl images amenities')
            .populate('tenant', 'firstName lastName email phone')
            .populate('landlord', 'firstName lastName email phone');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check if user is either tenant or landlord
        if (String(booking.tenant) !== req.session.userId && String(booking.landlord) !== req.session.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

module.exports = router; 