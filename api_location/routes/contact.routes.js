const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

router.post('/', contactController.createContactMessage);
router.get('/', authenticateToken, checkAdmin, contactController.getAllContactMessages);
router.get('/stats', authenticateToken, checkAdmin, contactController.getDashboardStats);
router.get('/:id', authenticateToken, checkAdmin, contactController.getContactMessageById);
router.put('/:id/read', authenticateToken, checkAdmin, contactController.markAsRead);
router.delete('/:id', authenticateToken, checkAdmin, contactController.deleteContactMessage);

module.exports = router;
