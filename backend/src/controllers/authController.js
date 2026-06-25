const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const Booking = require('../models/Booking');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !phone || !password) {
      return res.status(400).json({ message: 'Email, phone, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      phone,
      password_hash: hashedPassword,
      first_name: firstName || '',
      last_name: lastName || '',
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Customer registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Provider Registration
exports.registerProvider = async (req, res) => {
  try {
    const { email, phone, password, name, city, serviceCategories } = req.body;

    // Validate input
    if (!email || !phone || !password || !name) {
      return res.status(400).json({ message: 'Email, phone, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if provider already exists
    const existingProvider = await ServiceProvider.findOne({
      where: {
        [require('sequelize').Op.or]: [{ email }, { phone }],
      },
    });

    if (existingProvider) {
      return res.status(400).json({ message: 'Email or phone already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create provider
    const provider = await ServiceProvider.create({
      email,
      phone,
      password_hash: hashedPassword,
      name,
      city: city || '',
      service_categories: serviceCategories || [],
    });

    // Generate JWT
    const token = jwt.sign(
      { id: provider.id, email: provider.email, type: 'provider' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Provider registered successfully',
      token,
      provider: {
        id: provider.id,
        email: provider.email,
        phone: provider.phone,
        name: provider.name,
        city: provider.city,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Customer Login
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.is_active === false) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact platform support.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, type: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Customer Account (DPDP Act, 2023 — right to erasure)
//
// Removes the customer's personal data. Bookings without a completed payment
// contain personal data (service address) and are deleted outright. Bookings
// with a completed payment are transaction records we are required to retain
// for tax purposes, so when any exist the user row is anonymised (PII scrubbed,
// login disabled) instead of deleted, which also keeps the foreign key valid.
exports.deleteCustomerAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res
        .status(400)
        .json({ message: 'Please confirm your password to delete your account' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Re-authenticate before this irreversible action.
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    await sequelize.transaction(async (t) => {
      // Delete bookings that are not retained financial records.
      await Booking.destroy({
        where: {
          customer_id: userId,
          payment_status: { [Op.ne]: 'completed' },
        },
        transaction: t,
      });

      // Any paid bookings we must keep for tax records?
      const retained = await Booking.count({
        where: { customer_id: userId, payment_status: 'completed' },
        transaction: t,
      });

      if (retained > 0) {
        // Anonymise: scrub PII and disable login while preserving the row
        // (and its foreign-key links to retained transaction records).
        const randomHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
        await user.update(
          {
            email: `deleted+${userId}@deleted.gharpahuchseva.com`,
            phone: `DELETED-${userId}`,
            password_hash: randomHash,
            first_name: 'Deleted',
            last_name: 'User',
            profile_picture: null,
            address: null,
            city: null,
            pincode: null,
          },
          { transaction: t }
        );
      } else {
        // No records to retain — remove the account entirely.
        await user.destroy({ transaction: t });
      }
    });

    res.json({ message: 'Your account has been deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Provider Login
exports.loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const provider = await ServiceProvider.findOne({ where: { email } });

    if (!provider) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (provider.is_active === false) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact platform support.' });
    }

    const isValidPassword = await bcrypt.compare(password, provider.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: provider.id, email: provider.email, type: 'provider' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      provider: {
        id: provider.id,
        email: provider.email,
        phone: provider.phone,
        name: provider.name,
        city: provider.city,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
