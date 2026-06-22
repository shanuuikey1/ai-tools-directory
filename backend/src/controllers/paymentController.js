const Booking = require('../models/Booking');
const axios = require('axios');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: 'Booking ID and amount are required' });
    }

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId,
      },
    };

    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      options,
      {
        auth: {
          username: RAZORPAY_KEY_ID,
          password: RAZORPAY_KEY_SECRET,
        },
      }
    );

    const razorpayOrder = response.data;

    // Save order ID to booking
    await booking.update({
      razorpay_order_id: razorpayOrder.id,
    });

    res.json({
      message: 'Order created successfully',
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      key: RAZORPAY_KEY_ID,
      bookingId: bookingId,
    });
  } catch (error) {
    console.error('Razorpay error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Verify Payment
exports.verifyPayment = async (req, res) => {
  try {
    const { bookingId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    if (!bookingId || !razorpayPaymentId || !razorpayOrderId) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const crypto = require('crypto');

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update booking
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await booking.update({
      razorpay_payment_id: razorpayPaymentId,
      payment_status: 'completed',
    });

    res.json({
      message: 'Payment verified successfully',
      booking: {
        id: booking.id,
        paymentStatus: booking.payment_status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Payment History (Customer)
exports.getPaymentHistory = async (req, res) => {
  try {
    const customerId = req.user.id;

    const bookings = await Booking.findAll({
      where: {
        customer_id: customerId,
        payment_status: 'completed',
      },
      attributes: [
        'id',
        'service_price',
        'payment_status',
        'created_at',
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: 'Payment history retrieved successfully',
      payments: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
