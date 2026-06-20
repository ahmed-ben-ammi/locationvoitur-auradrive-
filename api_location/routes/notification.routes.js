const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/mark-all-read', notificationController.markAllAsRead);

module.exports = router;