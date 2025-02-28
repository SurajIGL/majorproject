const Review = require('../models/Review');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    
    if (!bookingId || !rating || !comment) {
      return res.status(400).json({ error: 'Please provide booking ID, rating and comment' });
    }

    // Check if booking exists and belongs to the current user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify the booking belongs to the current user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You can only review your own bookings' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'You can only review completed bookings' });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already submitted a review for this booking' });
    }

    // Create the new review
    const review = new Review({
      user: req.user.id,
      item: booking.item,
      booking: bookingId,
      rating,
      comment
    });

    await review.save();
    
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get reviews for a specific item
exports.getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const reviews = await Review.find({ item: itemId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    let totalRating = 0;
    reviews.forEach(review => {
      totalRating += review.rating;
    });
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating,
      reviews
    });
  } catch (error) {
    console.error('Get item reviews error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
