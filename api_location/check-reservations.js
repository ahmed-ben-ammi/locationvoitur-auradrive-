const db = require('./config/db');

async function checkReservations() {
  try {
    const testId = 6;
    console.log('🔍 Testing reservation ID:', testId);
    
    // Test findById query
    const [findByIdRows] = await db.query(`
      SELECT 
        r.id, r.user_id, r.voiture_id, r.date_debut, r.date_fin, r.statut, r.created_at,
        v.marque, v.modele, v.annee, v.numero_immatriculation, v.image, v.prix_par_jour,
        u.name AS full_name, u.CNE AS cne, u.phone
      FROM reservation r
      LEFT JOIN voitures v ON r.voiture_id = v.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [testId]);
    console.log('✅ findById query result:', findByIdRows);

    // Test getReservationWithUser query
    const [getUserRows] = await db.query(`
      SELECT r.id, r.user_id, r.voiture_id, r.date_debut, r.date_fin, r.statut, r.created_at, u.phone
      FROM reservation r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [testId]);
    console.log('✅ getReservationWithUser query result:', getUserRows);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkReservations();
