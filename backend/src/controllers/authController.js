const User = require('../models/User');
const ServiceProvider = require('../models/ServiceProvider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !phone || !password) {
      return res.status(400).json({ message: 'Email, phone, and password are required' });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};
