const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const ProfessionalApplication = require('../models/ProfessionalApplication');
const { Op } = require('sequelize');

// Get Platform Overview Analytics
exports.getPlatformStats = async (req, res) => {
  try {
    const totalCustomers = await User.count();
    const totalProviders = await ServiceProvider.count();
    const totalApplications = await ProfessionalApplication.count();

    // Booking counts by status
    const totalBookings = await Booking.count();
    const pendingBookings = await Booking.count({ where: { status: 'pending' } });
    const acceptedBookings = await Booking.count({ where: { status: 'accepted' } });
    const completedBookings = await Booking.count({ where: { status: 'completed' } });
    const cancelledBookings = await Booking.count({ where: { status: 'cancelled' } });

    // Revenue calculations (only from paid bookings)
    const paidBookings = await Booking.findAll({
      where: { payment_status: 'completed' },
      attributes: ['service_price', 'platform_commission', 'provider_earning'],
    });

    const totalRevenue = paidBookings.reduce((sum, b) => sum + parseFloat(b.service_price || 0), 0);
    const platformEarnings = paidBookings.reduce((sum, b) => sum + parseFloat(b.platform_commission || 0), 0);
    const providerEarnings = paidBookings.reduce((sum, b) => sum + parseFloat(b.provider_earning || 0), 0);

    res.json({
      stats: {
        totalCustomers,
        totalProviders,
        totalApplications,
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          accepted: acceptedBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
        },
        financials: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          platformEarnings: parseFloat(platformEarnings.toFixed(2)),
          providerEarnings: parseFloat(providerEarnings.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch platform stats' });
  }
};

// Get All Bookings across the platform
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name', 'email', 'phone'],
        },
        {
          model: ServiceProvider,
          attributes: ['name', 'email', 'phone', 'service_categories'],
        },
        {
          model: Service,
          attributes: ['name', 'category'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Get All Service Providers
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.findAll({
      // Never expose the password hash or sensitive financial/identity fields
      // (Aadhaar / bank / IFSC) in a list endpoint, even to an admin client.
      attributes: { exclude: ['password_hash', 'bank_account', 'ifsc_code', 'aadhar_number'] },
      order: [['createdAt', 'DESC']],
    });

    res.json({ providers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch service providers' });
  }
};

// Update Service Provider Verification Status
exports.updateProviderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pending', 'verified', 'rejected'

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const provider = await ServiceProvider.findByPk(id);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    provider.verification_status = status;
    await provider.save();

    res.json({
      message: `Service provider status updated to ${status}`,
      provider: {
        id: provider.id,
        name: provider.name,
        email: provider.email,
        verification_status: provider.verification_status,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update provider status' });
  }
};

// Get All Services (including inactive ones for management)
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [
        ['category', 'ASC'],
        ['name', 'ASC'],
      ],
    });

    res.json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

// Toggle Service Active Status (Deactivate/Activate)
exports.toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.is_active = isActive;
    await service.save();

    res.json({
      message: `Service is now ${isActive ? 'active' : 'inactive'}`,
      service: {
        id: service.id,
        name: service.name,
        is_active: service.is_active,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to toggle service status' });
  }
};

// Get All Customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'is_active', 'createdAt', 'total_bookings'],
      order: [['createdAt', 'DESC']],
    });
    res.json({ customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
};

// Toggle Customer Active Status
exports.toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const customer = await User.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.is_active = isActive;
    await customer.save();

    res.json({
      message: `Customer account has been ${isActive ? 'activated' : 'suspended'}`,
      customer: {
        id: customer.id,
        email: customer.email,
        is_active: customer.is_active,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to toggle customer status' });
  }
};

// Update Booking Status Overrides (Status & Payment)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status) {
      if (!['pending', 'accepted', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid booking status' });
      }
      booking.status = status;
      if (status === 'completed') {
        booking.completed_at = new Date();
      }
    }

    if (payment_status) {
      if (!['pending', 'completed', 'failed'].includes(payment_status)) {
        return res.status(400).json({ message: 'Invalid payment status' });
      }
      booking.payment_status = payment_status;
    }

    await booking.save();

    // Fetch updated booking with relations
    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name', 'email', 'phone'],
        },
        {
          model: ServiceProvider,
          attributes: ['name', 'email', 'phone', 'service_categories'],
        },
        {
          model: Service,
          attributes: ['name', 'category'],
        },
      ],
    });

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
};

// Reassign Service Provider to Booking
exports.reassignBookingProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { providerId } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const provider = await ServiceProvider.findByPk(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    if (provider.verification_status !== 'verified' || !provider.is_active) {
      return res.status(400).json({ message: 'Service provider must be verified and active to be assigned' });
    }

    booking.provider_id = providerId;
    await booking.save();

    // Fetch updated booking with relations
    const updatedBooking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name', 'email', 'phone'],
        },
        {
          model: ServiceProvider,
          attributes: ['name', 'email', 'phone', 'service_categories'],
        },
        {
          model: Service,
          attributes: ['name', 'category'],
        },
      ],
    });

    res.json({
      message: 'Service provider reassigned successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reassign service provider' });
  }
};

// Update Service Catalog Item
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, basePrice, description, imageUrl } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (name) service.name = name;
    if (category) service.category = category;
    if (basePrice !== undefined) service.base_price = parseFloat(basePrice);
    if (description !== undefined) service.description = description;
    if (imageUrl !== undefined) service.imageUrl = imageUrl;

    await service.save();

    res.json({
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update service' });
  }
};

// Delete Service Catalog Item
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if there are bookings linked to this service
    const linkedBookingsCount = await Booking.count({ where: { service_id: id } });
    if (linkedBookingsCount > 0) {
      // Deactivate instead of hard deleting to preserve referential integrity
      service.is_active = false;
      await service.save();
      return res.status(400).json({
        message: 'Cannot delete service with active booking history. The service has been deactivated instead.',
        service,
      });
    }

    await service.destroy();
    res.json({
      message: 'Service deleted successfully from catalog',
      id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete service' });
  }
};
