require('dotenv').config();
const db = require('./config/db');

async function fixTable() {
  console.log('🔧 [fix-table-column] Starting...');
  try {
    // Check if full_name column exists
    const [columns] = await db.query(`DESCRIBE contact_messages`);
    console.log('📊 [fix-table-column] Current columns:', columns);

    // Rename full_name to name
    console.log('🔧 [fix-table-column] Renaming column full_name → name');
    await db.query(`ALTER TABLE contact_messages CHANGE COLUMN full_name name VARCHAR(255) NOT NULL`);

    console.log('✅ [fix-table-column] Column renamed successfully!');

    // Verify
    const [newColumns] = await db.query(`DESCRIBE contact_messages`);
    console.log('✅ [fix-table-column] New columns:', newColumns);

    process.exit(0);
  } catch (error) {
    console.error('❌ [fix-table-column] Error:', error);
    process.exit(1);
  }
}

fixTable();
