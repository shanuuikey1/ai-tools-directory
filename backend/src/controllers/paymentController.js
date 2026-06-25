const Booking = require('../models/Booking');
const axios = require('axios');
const notificationService = require('../services/notificationService');

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

    // Check if Razorpay credentials are not configured or are placeholders
    const isPlaceholderKey = !RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === 'your_razorpay_key_id' || RAZORPAY_KEY_ID.startsWith('your_');

    // The sandbox mock marks bookings paid WITHOUT a real payment or signature
    // check. That is only ever acceptable outside production — in production we
    // must fail closed so missing/placeholder keys can't become free bookings.
    if (isPlaceholderKey && process.env.NODE_ENV === 'production') {
      console.error('✗ Razorpay credentials are not configured in production. Refusing to mock-complete payment.');
      return res.status(503).json({ message: 'Payments are temporarily unavailable' });
    }

    if (isPlaceholderKey) {
      console.warn('⚠️ Razorpay credentials are not configured. Falling back to Sandbox Mock Payment.');
      const mockOrderId = `order_mock_${Date.now()}`;
      await booking.update({
        razorpay_order_id: mockOrderId,
      });
      return res.json({
        message: 'Order created successfully (Sandbox Mock)',
        orderId: mockOrderId,
        amount: booking.service_price,
        key: 'sandbox_key',
        bookingId: bookingId,
        isMock: true,
      });
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
      isMock: false,
    });
  } catch (error) {
    console.error('Razorpay error:', error.message || error);
    // Graceful fallback in development if Razorpay API fails for other reasons
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Razorpay API request failed. Falling back to Sandbox Mock Payment.');
      const mockOrderId = `order_mock_${Date.now()}`;
      const booking = await Booking.findByPk(bookingId);
      if (booking) {
        await booking.update({ razorpay_order_id: mockOrderId });
        return res.json({
          message: 'Order created successfully (Sandbox Fallback)',
          orderId: mockOrderId,
          amount: booking.service_price,
          key: 'sandbox_key',
          bookingId: bookingId,
          isMock: true,
        });
      }
    }
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

    const isPlaceholderKey = !RAZORPAY_KEY_ID || RAZORPAY_KEY_ID === 'your_razorpay_key_id' || RAZORPAY_KEY_ID.startsWith('your_');
    // The mock path bypasses signature verification, so it must never be
    // reachable in production even if keys are somehow placeholders there.
    const isMock =
      isPlaceholderKey &&
      process.env.NODE_ENV !== 'production' &&
      (razorpayOrderId.startsWith('order_mock_') || razorpayOrderId.startsWith('order_fallback_'));

    if (!isMock) {
      const crypto = require('crypto');
      // A real (non-mock) verification requires the signature to be present.
      if (!razorpaySignature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
      // Verify signature with a constant-time comparison so the validity of a
      // forged signature can't be inferred from response timing.
      const body = razorpayOrderId + '|' + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf8');
      const providedBuf = Buffer.from(String(razorpaySignature), 'utf8');
      if (
        expectedBuf.length !== providedBuf.length ||
        !crypto.timingSafeEqual(expectedBuf, providedBuf)
      ) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    } else {
      console.log(`✓ Verifying sandbox mock payment for Booking #${bookingId}`);
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

    // Dispatch WhatsApp group notification asynchronously
    notificationService.sendBookingNotification(booking.id).catch(err => {
      console.error('[Notification] Error triggering booking notification:', err);
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
