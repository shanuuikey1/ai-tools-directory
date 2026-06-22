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

module.exports = { authenticateCustomer, authenticateProvider };
