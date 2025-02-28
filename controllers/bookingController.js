const Booking = require('../models/Booking');
const Item = require('../models/Item');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { item, startDate, endDate } = req.body;
    const user = req.user.id;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ msg: 'End date must be after start date' });
    }
    
    if (start < new Date()) {
      return res.status(400).json({ msg: 'Cannot book in the past' });
    }

    // Check if item exists
    const itemDetails = await Item.findById(item);
    if (!itemDetails) {
      return res.status(404).json({ msg: 'Item not found' });
    }

    // Check for scheduling conflicts
    const conflictingBookings = await Booking.find({
      item: item,
      status: { $nin: ['canceled'] },
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
        { startDate: { $gte: start, $lte: end } },
        { endDate: { $gte: start, $lte: end } }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({ msg: 'Item is not available for the selected dates' });
    }

    // Create booking
    const newBooking = new Booking({
      user,
      item,
      startDate: start,
      endDate: end
    });

    await newBooking.save();

    // Update item availability status
    await updateItemAvailability(item);

    res.status(201).json(newBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all bookings (with optional filters)
exports.getBookings = async (req, res) => {
  try {
    const filter = {};
    
    // Admin can see all bookings, regular users can only see their own
    if (!req.user.isAdmin) {
      filter.user = req.user.id;
    } else if (req.query.user) {
      filter.user = req.query.user;
    }
    
    // Filter by item if provided
    if (req.query.item) {
      filter.item = req.query.item;
    }
    
    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .populate('item', 'name price description');

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get a booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('item', 'name price description');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Check if the user is authorized to view this booking
    if (booking.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update booking status
exports.updateBooking = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Only admin or the booking owner can update
    if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update status
    booking.status = status;
    await booking.save();
    
    // Update item availability
    await updateItemAvailability(booking.item);

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Only admin or the booking owner can cancel
    if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Set status to canceled
    booking.status = 'canceled';
    await booking.save();
    
    // Update item availability
    await updateItemAvailability(booking.item);

    res.json({ msg: 'Booking canceled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Helper function to update item availability based on bookings
async function updateItemAvailability(itemId) {
  try {
    const currentDate = new Date();
    
    // Check if there are any active or upcoming bookings
    const activeBookings = await Booking.find({
      item: itemId,
      status: { $in: ['confirmed', 'pending'] },
      endDate: { $gt: currentDate }
    });

    const item = await Item.findById(itemId);
    if (!item) return;

    // If there are active bookings that overlap with current time
    const currentlyBooked = activeBookings.some(booking => 
      booking.startDate <= currentDate && booking.endDate >= currentDate
    );

    // Update availability based on current bookings
    item.available = activeBookings.length === 0 || !currentlyBooked;
    
    await item.save();
  } catch (err) {
    console.error('Error updating item availability:', err);
  }
}
