
const db = require('./config/db');

const runMigration = async () => {
  try {
    console.log('Creating contact_messages table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        cne VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ contact_messages table created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating contact_messages table:', err);
    process.exit(1);
  }
};

runMigration();
