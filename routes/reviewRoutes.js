const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { isAuthenticated } = require('../middleware/auth');

// POST /api/reviews - Create a new review (restricted to authenticated users)
router.post('/', isAuthenticated, reviewController.createReview);

// GET /api/reviews/:itemId - Get all reviews for a specific item
router.get('/:itemId', reviewController.getItemReviews);

module.exports = router;
