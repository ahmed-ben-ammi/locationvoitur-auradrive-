// index.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.use('/auth', require('./auth.routes'));
router.use('/vehicles', require('./vehicle.routes'));
router.use('/contact', require('./contact.routes'));

// Protected routes (authentication required)
router.use('/users', authenticateToken, require('./user.routes'));
router.use('/reservations', authenticateToken, require('./reservation.routes'));
router.use(
  '/notifications',
  authenticateToken,
  require('./notification.routes')
);

module.exports = router;
