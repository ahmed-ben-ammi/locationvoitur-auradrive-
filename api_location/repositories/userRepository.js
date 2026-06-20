const db = require("../config/db");
const bcrypt = require('bcrypt');

module.exports = {
  async findAll() {
    const [results] = await db.query("SELECT id, name, CNE, phone, role FROM users");
    return results;
  },

  async findById(id) {
    const [results] = await db.query(
      "SELECT id, name, CNE, phone, role FROM users WHERE id = ?",
      [id]
    );
    return results[0];
  },

  async findByPhone(phone) {
    const [results] = await db.query(
      "SELECT id FROM users WHERE phone = ?",
      [phone]
    );
    return results[0];
  },

  async findByCNE(CNE) {
    const [results] = await db.query(
      "SELECT id FROM users WHERE CNE = ?",
      [CNE]
    );
    return results[0];
  },

  async create(data) {
    const { name, CNE, phone, password, role } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, CNE, phone, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, CNE, phone, hashedPassword, role]
    );
    return { id: result.insertId, name, CNE, phone, role };
  },

  async update(id, data) {
    const { name, CNE, phone, password, role } = data;
    let query = "UPDATE users SET name = ?, CNE = ?, phone = ?, role = ?";
    let params = [name, CNE, phone, role];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id = ?";
    params.push(id);

    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  // async updateStatus(id, status) {
  //   const [result] = await db.query(
  //     "UPDATE users SET status = ? WHERE id = ?",
  //     [status, id]
  //   );
  //   return result.affectedRows > 0;
  // },

  async updateRole(id, role) {
    const [result] = await db.query(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, id]
    );
    return result.affectedRows > 0;
  }
};
