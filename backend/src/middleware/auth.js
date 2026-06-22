const jwt = require('jsonwebtoken');

const authenticateCustomer = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      if (user.type !== 'customer') {
        return res.status(403).json({ message: 'Customer authentication required' });
      }
      req.user = user;
      req.userType = 'customer';
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const authenticateProvider = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      if (user.type !== 'provider') {
        return res.status(403).json({ message: 'Provider authentication required' });
      }
      req.user = user;
      req.userType = 'provider';
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Guards admin-only routes (e.g. creating services). Set ADMIN_API_KEY
// in the environment and send it as the `x-admin-key` header.
const authenticateAdmin = (req, res, next) => {
  const configured = process.env.ADMIN_API_KEY;
  if (!configured) {
    // Fail closed: if no admin key is set, the route is locked.
    return res.status(503).json({ message: 'Admin operations are disabled' });
  }
  const provided = req.headers['x-admin-key'];
  if (provided !== configured) {
    return res.status(401).json({ message: 'Invalid admin key' });
  }
  next();
};

module.exports = { authenticateCustomer, authenticateProvider, authenticateAdmin };
