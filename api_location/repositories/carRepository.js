// carRepository.js
const db = require("../config/db");

const findAll = async () => {
    const [rows] = await db.query('SELECT * FROM voitures');
    return rows;
};

const findById = async (id) => {
    const [rows] = await db.query('SELECT * FROM voitures WHERE id = ?', [id]);
    return rows[0] || null;
};

const create = async (carData) => {
    const [result] = await db.query('INSERT INTO voitures SET ?', [carData]);
    return result.insertId;
};

const update = async (id, carData) => {
    const [result] = await db.query('UPDATE voitures SET ? WHERE id = ?', [carData, id]);
    return result.affectedRows;
};

const updateStatus = async (id, newStatus) => {
    const [result] = await db.query('UPDATE voitures SET statut = ? WHERE id = ?', [newStatus, id]);
    return result.affectedRows;
};

const remove = async (id) => {
    const [result] = await db.query('DELETE FROM voitures WHERE id = ?', [id]);
    return result.affectedRows;
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    updateStatus,
    remove
};
