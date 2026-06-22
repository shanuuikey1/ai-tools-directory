const Booking = require('../models/Booking');
const axios = require('axios');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the customer who owns the booking may pay for it.
    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.payment_status === 'completed') {
      return res.status(400).json({ message: 'Booking is already paid' });
    }

    // Authoritative amount comes from the booking, never the client.
    const amount = parseFloat(booking.service_price);

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
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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

    // Only the customer who owns the booking may confirm its payment,
    // and the signed order must match the one stored on the booking.
    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (booking.razorpay_order_id !== razorpayOrderId) {
      return res.status(400).json({ message: 'Order does not match booking' });
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
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
