
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/checkAdmin');

// Toutes les routes sont protégées par authenticateToken et checkAdmin
router.get('/', authenticateToken, checkAdmin, userController.getAllUsers);
router.get('/:id', authenticateToken, checkAdmin, userController.getUserById);
router.post('/', authenticateToken, checkAdmin, userController.postUser);
router.put('/:id', authenticateToken, checkAdmin, userController.putUser);
router.delete('/:id', authenticateToken, checkAdmin, userController.deleteUser);
router.patch('/:id', authenticateToken, checkAdmin, userController.patchUser);
router.patch('/:id/role', authenticateToken, checkAdmin, userController.patchUserRole);

module.exports = router;