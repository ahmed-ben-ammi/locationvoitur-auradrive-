// reservationRepository.js
const db = require('../config/db');

async function findAll() {
  console.log('🔍 [reservationRepository] findAll() called');
  const [rows] = await db.query(`
    SELECT 
      r.id, r.user_id, r.voiture_id, r.date_debut, r.date_fin, r.statut, r.created_at,
      v.marque, v.modele, v.annee, v.numero_immatriculation, v.image, v.prix_par_jour,
      u.name AS full_name, u.CNE AS cne, u.phone
    FROM reservation r
    LEFT JOIN voitures v ON r.voiture_id = v.id
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `);
  console.log('✅ [reservationRepository] findAll() returned', rows.length, 'rows');
  console.log('📊 Rows:', rows);
  return rows;
}

async function findById(id) {
  const [rows] = await db.query(`
    SELECT 
      r.id, r.user_id, r.voiture_id, r.date_debut, r.date_fin, r.statut, r.created_at,
      v.marque, v.modele, v.annee, v.numero_immatriculation, v.image, v.prix_par_jour,
      u.name AS full_name, u.CNE AS cne, u.phone
    FROM reservation r
    LEFT JOIN voitures v ON r.voiture_id = v.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `, [id]);
  return rows[0];
}

async function findByUserId(userId) {
  const [rows] = await db.query(`
    SELECT 
      r.id, r.user_id, r.voiture_id, r.date_debut, r.date_fin, r.statut, r.created_at,
      v.marque, v.modele, v.annee, v.numero_immatriculation, v.image, v.prix_par_jour
    FROM reservation r
    LEFT JOIN voitures v ON r.voiture_id = v.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `, [userId]);
  return rows;
}

async function isOwner(reservationId, userId) {
  const [rows] = await db.query(
    "SELECT id FROM reservation WHERE id = ? AND user_id = ?",
    [reservationId, userId]
  );
  return rows.length > 0;
}

async function isVoitureDisponible(voiture_id, date_debut, date_fin) {
  const sql = `
    SELECT COUNT(*) AS count FROM reservation
    WHERE voiture_id = ?
      AND statut IN ('en_attente', 'confirmée')
      AND date_debut <= ?
      AND date_fin >= ?
  `;
  const [rows] = await db.query(sql, [voiture_id, date_fin, date_debut]);
  return rows[0].count === 0;
}

async function create({ user_id, voiture_id, date_debut, date_fin, statut }) {
  const dispo = await isVoitureDisponible(voiture_id, date_debut, date_fin);
  if (!dispo) {
    throw new Error('Cette voiture est déjà réservée pour cette période.');
  }

  const [result] = await db.query(
    `INSERT INTO reservation 
     (user_id, voiture_id, date_debut, date_fin, statut) 
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, voiture_id, date_debut, date_fin, statut]
  );
  return result.insertId;
}

async function updateStatus(id, statut) {
  console.log('🔍 [reservationRepository] updateStatus() called with id:', id, ', statut:', statut);
  const [result] = await db.query("UPDATE reservation SET statut = ? WHERE id = ?", [statut, id]);
  console.log('✅ [reservationRepository] updateStatus() result:', result);
  return result;
}

async function deleteReservation(id) {
  await db.query("DELETE FROM reservation WHERE id = ?", [id]);
}
async function getReservationWithUser(id) {
  console.log('🔍 [reservationRepository] getReservationWithUser() called with id:', id);
  const [rows] = await db.query(`
    SELECT r.id, r.user_id, r.voiture_id, r.date_debut, r.date_fin, r.statut, r.created_at, u.phone
    FROM reservation r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `, [id]);
  console.log('✅ [reservationRepository] getReservationWithUser() rows:', rows);
  return rows[0];
}

module.exports = {
  findAll,
  findById,
  findByUserId,
  isOwner,
  create,
  updateStatus,
  delete: deleteReservation,
  isVoitureDisponible,
  getReservationWithUser
};



