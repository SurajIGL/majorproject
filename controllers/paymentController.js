const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay with your key_id and key_secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_yourkeyhere',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'yoursecrethere'
});

/**
 * Create a new payment order
 */
exports.createPayment = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Create order with Razorpay
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes,
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment order creation failed',
      details: error.message
    });
  }
};

/**
 * Verify payment signature
 */
exports.verifyPayment = (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required payment verification parameters' 
      });
    }

    // Creating the signature verification data string
    const generatedSignature = crypto
      .createHmac('sha256', razorpay.key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Comparing the signatures
    if (generatedSignature === razorpay_signature) {
      // Payment is successful and verified
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      // Payment verification failed
      res.status(400).json({
        success: false,
        error: 'Payment verification failed: Invalid signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      details: error.message
    });
  }
};
