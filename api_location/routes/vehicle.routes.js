// vehicle.routes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const upload = require('../config/multerConfig');

// Import middlewares
const { authenticateToken } = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// --- Public routes (no authentication required) ---
router.get('/', carController.getAllcars);
router.get('/:id', carController.getCarById);

// --- Admin-only routes (require authentication and admin role) ---
router.post(
  '/',
  authenticateToken,
  checkAdmin,
  upload.single('image'),
  carController.createCar
);

router.put(
  '/:id',
  authenticateToken,
  checkAdmin,
  upload.single('image'),
  carController.updateCar
);

router.patch(
  '/:id/statut',
  authenticateToken,
  checkAdmin,
  carController.updateCarStatus
);

router.delete(
  '/:id',
  authenticateToken,
  checkAdmin,
  carController.deleteCar
);

module.exports = router;