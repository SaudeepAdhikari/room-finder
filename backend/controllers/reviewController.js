const Joi = require('joi');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Validation schema for review creation
 */
const reviewSchema = Joi.object({
    room: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().min(5).required().messages({
        'string.min': 'Comment must be at least 5 characters long'
    })
});

/**
 * POST /api/reviews
 * Creates a new review for a room
 */
exports.createReview = async (req, res, next) => {
    try {
        // 1. Validate inputs
        const { error, value } = reviewSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { room, rating, comment } = value;
        const userId = req.session.userId;

        // 2. Business logic: Check for completed booking
        const booking = await Booking.findOne({
            tenant: userId,
            room: room,
            status: 'completed'
        });

        if (!booking) {
            return res.status(403).json({ 
                error: 'You must have a completed booking for this room to leave a review.' 
            });
        }

        // 3. Business logic: Prevent duplicate reviews
        const existingReview = await Review.findOne({ user: userId, room: room });
        if (existingReview) {
            return res.status(409).json({ error: 'You have already reviewed this room.' });
        }

        // 4. Create review with pending status
        const review = new Review({
            user: userId,
            room: room,
            rating,
            comment,
            status: 'pending' // default is pending in schema as well
        });

        await review.save();

        // 5. Notify admin (Bonus/Requirement 6)
        try {
            // Find an admin user to send notification to (or just create for all admins)
            const admin = await User.findOne({ isAdmin: true });
            if (admin) {
                const user = await User.findById(userId);
                const userName = user ? `${user.firstName} ${user.lastName}` : 'A user';
                
                await Notification.create({
                    recipient: admin._id,
                    message: `New review submitted by ${userName} for room ${room}. Pending approval.`,
                    type: 'info',
                    relatedId: review._id,
                    relatedModel: 'Room' // The Review schema doesn't have a model ref in Notification schema, so we use Room or just link to review if possible
                });
            }
        } catch (notifErr) {
            console.error('Failed to create admin notification for review:', notifErr.message);
        }

        res.status(201).json({
            message: 'Review submitted successfully. It will be visible once approved by an admin.',
            review
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/reviews/:roomId
 * Returns all approved reviews for a specific room
 */
exports.getRoomReviews = async (req, res, next) => {
    try {
        const { roomId } = req.params;

        const reviews = await Review.find({ 
            room: roomId, 
            status: 'approved' 
        })
        .populate('user', 'firstName lastName avatar')
        .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        next(err);
    }
};

/**
 * PATCH /api/admin/reviews/:id
 * Admin endpoint to approve or reject a review
 */
exports.updateReviewStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const review = await Review.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        ).populate('user', 'firstName lastName email');

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Notify user about status change
        try {
            await Notification.create({
                recipient: review.user._id,
                message: `Your review for room ${review.room} has been ${status}.`,
                type: status === 'approved' ? 'success' : 'warning',
                relatedId: review._id,
                relatedModel: 'Room'
            });
        } catch (notifErr) {
            console.error('Failed to notify user about review status change:', notifErr.message);
        }

        res.json({
            message: `Review ${status} successfully.`,
            review
        });
    } catch (err) {
        next(err);
    }
};
