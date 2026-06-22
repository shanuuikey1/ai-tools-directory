const Booking = require('../models/Booking');
const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');

// Create Booking (Customer)
exports.createBooking = async (req, res) => {
  try {
    const { providerId, serviceId, serviceDate, serviceTime, serviceAddress, servicePrice } = req.body;
    const customerId = req.user.id;

    // Validate inputs
    if (!providerId || !serviceId || !serviceDate || !serviceTime || !serviceAddress || !servicePrice) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Calculate commission (25% to platform, 75% to provider)
    const platformCommission = parseFloat((servicePrice * 0.25).toFixed(2));
    const providerEarning = parseFloat((servicePrice * 0.75).toFixed(2));

    // Create booking
    const booking = await Booking.create({
      customer_id: customerId,
      provider_id: providerId,
      service_id: serviceId,
      service_date: serviceDate,
      service_time: serviceTime,
      service_address: serviceAddress,
      service_price: servicePrice,
      platform_commission: platformCommission,
      provider_earning: providerEarning,
      status: 'pending',
      payment_status: 'pending',
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        customerId: booking.customer_id,
        providerId: booking.provider_id,
        serviceId: booking.service_id,
        serviceDate: booking.service_date,
        serviceTime: booking.service_time,
        servicePrice: booking.service_price,
        platformCommission: booking.platform_commission,
        status: booking.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Customer Bookings
exports.getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user.id;

    const bookings = await Booking.findAll({
      where: { customer_id: customerId },
      include: [
        {
          model: ServiceProvider,
          attributes: ['name', 'phone', 'rating'],
        },
        {
          model: Service,
          attributes: ['name', 'category'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: 'Bookings retrieved successfully',
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Provider Bookings
exports.getProviderBookings = async (req, res) => {
  try {
    const providerId = req.user.id;

    const bookings = await Booking.findAll({
      where: { provider_id: providerId },
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name', 'phone', 'address', 'rating'],
        },
        {
          model: Service,
          attributes: ['name', 'category'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      message: 'Bookings retrieved successfully',
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept Booking (Provider)
exports.acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const providerId = req.user.id;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.provider_id !== providerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be accepted' });
    }

    await booking.update({ status: 'accepted' });

    res.json({
      message: 'Booking accepted successfully',
      booking: {
        id: booking.id,
        status: booking.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Booking (Provider)
exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const providerId = req.user.id;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.provider_id !== providerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be rejected' });
    }

    await booking.update({ status: 'cancelled' });

    res.json({
      message: 'Booking rejected successfully',
      booking: {
        id: booking.id,
        status: booking.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete Booking (Provider)
exports.completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const providerId = req.user.id;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.provider_id !== providerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status !== 'accepted') {
      return res.status(400).json({ message: 'Only accepted bookings can be completed' });
    }

    await booking.update({
      status: 'completed',
      completed_at: new Date(),
    });

    res.json({
      message: 'Booking completed successfully',
      booking: {
        id: booking.id,
        status: booking.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate Booking (Customer or Provider)
exports.rateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user.id;
    const userType = req.user.type;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (userType === 'customer') {
      if (booking.customer_id !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      await booking.update({
        customer_rating: rating,
        customer_feedback: feedback || '',
      });
    } else if (userType === 'provider') {
      if (booking.provider_id !== userId) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      await booking.update({
        provider_rating: rating,
        provider_feedback: feedback || '',
      });
    }

    res.json({
      message: 'Rating added successfully',
      booking: {
        id: booking.id,
        customer_rating: booking.customer_rating,
        provider_rating: booking.provider_rating,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
