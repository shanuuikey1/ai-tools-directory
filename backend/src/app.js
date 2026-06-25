const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const sequelize = require('./config/database');

// Fail fast on missing critical secrets. Without JWT_SECRET, tokens cannot be
// securely signed/verified, so refuse to start rather than run insecurely.
if (!process.env.JWT_SECRET) {
  console.error('✗ JWT_SECRET is not set. Refusing to start.');
  process.exit(1);
}
if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_API_KEY) {
  console.warn(
    '⚠ ADMIN_API_KEY is not set — admin routes will be disabled (fail-closed).'
  );
}
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
  console.warn(
    '⚠ CORS_ORIGIN is not set in production — all origins are allowed. ' +
      'Set CORS_ORIGIN to your web app origin(s) to lock this down.'
  );
}

// Import models (to sync with database)
const User = require('./models/User');
const ServiceProvider = require('./models/ServiceProvider');
const Service = require('./models/Service');
const Booking = require('./models/Booking');
const ProfessionalApplication = require('./models/ProfessionalApplication');

// Model associations. The booking controllers eager-load these relations
// (e.g. include: [{ model: ServiceProvider }, { model: Service }]), which
// only works once the associations are declared here.
Booking.belongsTo(User, { foreignKey: 'customer_id' });
Booking.belongsTo(ServiceProvider, { foreignKey: 'provider_id' });
Booking.belongsTo(Service, { foreignKey: 'service_id' });
User.hasMany(Booking, { foreignKey: 'customer_id' });
ServiceProvider.hasMany(Booking, { foreignKey: 'provider_id' });
Service.hasMany(Booking, { foreignKey: 'service_id' });

// Import routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const professionalRoutes = require('./routes/professionals');
const adminRoutes = require('./routes/admin');

const app = express();

// Behind Render/Heroku's reverse proxy. Trust exactly one proxy hop so that
// express-rate-limit and req.ip see the real client IP (via X-Forwarded-For)
// instead of bucketing every request under the proxy's address — while not
// blindly trusting an arbitrarily long, spoofable forwarding chain.
app.set('trust proxy', 1);

// Security headers. This is a JSON API (no server-rendered HTML), so a strict
// default CSP is safe and the defaults also set HSTS, X-Content-Type-Options,
// frameguard (anti-clickjacking), and remove X-Powered-By.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'same-site' },
    referrerPolicy: { policy: 'no-referrer' },
  })
);

// CORS: if CORS_ORIGIN is set (comma-separated list of allowed origins),
// lock to it; otherwise allow all (convenient before your domain is known).
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : null;
app.use(cors({ origin: corsOrigins || true }));

// Cap request body size to blunt memory-exhaustion / payload-flood DoS.
app.use(express.json({ limit: '100kb' }));

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
app.use('/api/professionals', professionalRoutes);
app.use('/api/admin', adminRoutes);

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
const autoSeed = require('./seed/autoSeed');

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log('✓ Database synced successfully');
    await autoSeed();
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
