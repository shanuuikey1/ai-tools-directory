const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const sequelize = require('./config/database');

// Import models (to sync with database)
const User = require('./models/User');
const ServiceProvider = require('./models/ServiceProvider');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');

const app = express();

// CORS: if CORS_ORIGIN is set (comma-separated list of allowed origins),
// lock to it; otherwise allow all (convenient before your domain is known).
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : null;
app.use(cors({ origin: corsOrigins || true }));
app.use(express.json());

// Rate limit auth endpoints to slow down brute-force attempts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Database sync and server start
const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('✓ Database synced successfully');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API docs: http://localhost:${PORT}/api`);
    });
  })
  .catch((err) => {
    console.error('✗ Database sync failed:', err);
    process.exit(1);
  });

module.exports = app;
