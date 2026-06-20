const db = require('../config/db');

class ContactRepository {
  async createContactMessage(data) {
    console.log('🏪 [contactRepository] createContactMessage called with data:', data);
    try {
      const { name, phone, cne, message } = data;
      const sql = `
        INSERT INTO contact_messages (name, phone, cne, message, is_read, created_at)
        VALUES (?, ?, ?, ?, 0, NOW())
      `;
      console.log('🏪 [contactRepository] Executing SQL:', sql, 'with params:', [name, phone, cne, message]);
      const [result] = await db.query(sql, [name, phone, cne, message]);
      console.log('🏪 [contactRepository] Query result:', result);
      return { id: result.insertId, ...data, is_read: false };
    } catch (error) {
      console.error('❌ [contactRepository] Error:', error);
      throw error;
    }
  }

  async getAllContactMessages(filters = {}) {
    let sql = `SELECT * FROM contact_messages ORDER BY created_at DESC`;
    const params = [];
    if (filters.status) {
      if (filters.status === 'unread') {
        sql = sql.replace('ORDER', 'WHERE is_read = 0 ORDER');
      } else if (filters.status === 'read') {
        sql = sql.replace('ORDER', 'WHERE is_read = 1 ORDER');
      }
    }
    const [rows] = await db.query(sql, params);
    return rows;
  }

  async getContactMessageById(id) {
    const sql = `SELECT * FROM contact_messages WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }

  async markAsRead(id) {
    const sql = `UPDATE contact_messages SET is_read = 1 WHERE id = ?`;
    await db.query(sql, [id]);
    return this.getContactMessageById(id);
  }

  async deleteContactMessage(id) {
    const sql = `DELETE FROM contact_messages WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  async getUnreadCount() {
    const sql = `SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0`;
    const [rows] = await db.query(sql);
    return rows[0].count;
  }

  async getTotalCount() {
    const sql = `SELECT COUNT(*) as count FROM contact_messages`;
    const [rows] = await db.query(sql);
    return rows[0].count;
  }
}

module.exports = new ContactRepository();
