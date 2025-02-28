const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  dailyRate: {
    type: Number,
    required: true
  },
  weeklyRate: {
    type: Number
  },
  monthlyRate: {
    type: Number
  },
  images: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    required: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', ItemSchema);
