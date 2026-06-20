const notificationRepo = require('../repositories/notificationRepository');

async function createNotification(data) {
    return await notificationRepo.createNotification(data);
}

async function getUserNotifications(user_id) {
    return await notificationRepo.getUserNotifications(user_id);
}

async function markNotificationAsRead(id, user_id) {
    return await notificationRepo.markNotificationAsRead(id, user_id);
}

async function markAllAsRead(user_id) {
    return await notificationRepo.markAllAsRead(user_id);
}

async function getAdminUsers() {
    return await notificationRepo.getAdminUsers();
}

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllAsRead,
    getAdminUsers
};