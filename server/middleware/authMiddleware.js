
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/env'); // Import config

// 1. Verify Token (Authentication)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret); // Use config.jwt.secret

      // Verify user exists and is active
      const userResult = await db.query(
        'SELECT id, name, email, role, status FROM users WHERE id = $1',
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }

      const user = userResult.rows[0];

      if (user.status !== 'active') {
        return res.status(403).json({ message: 'Account is suspended or blocked.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Check Role (Authorization)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Role '${req.user.role}' is not authorized.` });
    }
    next();
  };
};

module.exports = { protect, authorize };
