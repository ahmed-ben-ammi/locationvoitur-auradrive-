const notificationService = require('../services/notificationService');

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getUserNotifications(
            req.user.id
        );

        res.json(notifications);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const success = await notificationService.markNotificationAsRead(
            req.params.id,
            req.user.id
        );
        res.json({ success });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const success = await notificationService.markAllAsRead(req.user.id);
        res.json({ success });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getMyNotifications,
    markAsRead,
    markAllAsRead
};