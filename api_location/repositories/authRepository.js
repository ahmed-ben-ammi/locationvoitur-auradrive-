// authRepository.js
const db = require("../config/db");

module.exports = {
  async findByCNE(CNE) {
    const [users] = await db.query(
      "SELECT id, name, CNE, phone, role, password FROM users WHERE CNE = ?",
      [CNE]
    );
    return users;
  },

  async createUser({ name, CNE, hashedPassword, phone, role = "client" }) {
    const [result] = await db.query(
      "INSERT INTO users (name, CNE, password, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name, CNE, hashedPassword, phone, role]
    );
    return result.insertId;
  }
};
