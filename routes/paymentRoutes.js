const express = require('express');
const router = express.Router();
const { createPayment, verifyPayment } = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/auth'); // Assuming auth middleware exists

// Routes for payment operations
router.post('/create', isAuthenticated, createPayment);
router.post('/verify', isAuthenticated, verifyPayment);

module.exports = router;
