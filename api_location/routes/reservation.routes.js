// reservation.routes.js
const checkAdmin = require('../middleware/checkAdmin');
const { authenticateToken } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

router.get('/', checkAdmin, reservationController.getAll);
router.get('/:id', reservationController.getById);
router.get('/user/my', authenticateToken, reservationController.getByUser);
router.post('/', authenticateToken, reservationController.create);
router.put(
  '/:id/status',
  checkAdmin,
  reservationController.updateStatus
);
router.delete('/:id', checkAdmin, reservationController.delete);

module.exports = router;
