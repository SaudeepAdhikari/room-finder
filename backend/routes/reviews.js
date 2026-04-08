const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');

/**
 * Public routes
 */
// GET /api/reviews/:roomId - Get all approved reviews for a room
router.get('/:roomId', reviewController.getRoomReviews);

/**
 * Protected routes
 */
// POST /api/reviews - Create a new review (Requires auth and completed booking)
router.post('/', requireAuth, reviewController.createReview);

module.exports = router;
