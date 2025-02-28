const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Create a new booking
router.post('/', auth, bookingController.createBooking);

// Get all bookings (optionally filtered by user or item)
router.get('/', auth, bookingController.getBookings);

// Get a single booking by ID
router.get('/:id', auth, bookingController.getBookingById);

// Update a booking status
router.put('/:id', auth, bookingController.updateBooking);

// Cancel a booking
router.delete('/:id', auth, bookingController.cancelBooking);

module.exports = router;
