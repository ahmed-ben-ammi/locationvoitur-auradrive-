const db = require('../config/db');

async function createNotification({
    user_id,
    reservation_id,
    type,
    role,
    title,
    message
}) {
    console.log('🔍 [notificationRepository] createNotification() called with:', { user_id, reservation_id, type, role, title, message });
    try {
        const [result] = await db.query(
            `INSERT INTO notifications
            (user_id, reservation_id, type, role, title, message)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, reservation_id, type, role, title, message]
        );
        console.log('✅ [notificationRepository] createNotification() result:', result);
        return result.insertId;
    } catch (error) {
        console.error('❌ [notificationRepository] createNotification() error:', error);
        throw error;
    }
}

async function getUserNotifications(user_id) {
    const [rows] = await db.query(
        `SELECT *
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [user_id]
    );

    return rows;
}

async function markNotificationAsRead(id, user_id) {
    const [result] = await db.query(
        `UPDATE notifications
         SET is_read = 1
         WHERE id = ? AND user_id = ?`,
        [id, user_id]
    );
    return result.affectedRows > 0;
}

async function markAllAsRead(user_id) {
    const [result] = await db.query(
        `UPDATE notifications
         SET is_read = 1
         WHERE user_id = ?`,
        [user_id]
    );
    return result.affectedRows > 0;
}

async function getAdminUsers() {
    const [rows] = await db.query(
        `SELECT id
         FROM users
         WHERE role = 'admin'`
    );
    return rows;
}

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllAsRead,
    getAdminUsers
};