require('dotenv').config();
const db = require('./config/db');

async function testDatabase() {
  console.log('🚀 [test-db] Starting database test...');
  try {
    console.log('✅ [test-db] DB config:', {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });

    // Test connection
    const [connectionResult] = await db.query('SELECT 1 as test');
    console.log('✅ [test-db] Database connection successful!', connectionResult);

    // Check if table exists
    const [tables] = await db.query(`SHOW TABLES LIKE 'contact_messages'`);
    console.log('✅ [test-db] Checked contact_messages table:', tables);

    if (tables.length > 0) {
      console.log('✅ [test-db] Table exists! Let\'s check columns:');
      const [columns] = await db.query(`DESCRIBE contact_messages`);
      console.log('📊 [test-db] Table columns:', columns);
    } else {
      console.log('❌ [test-db] Table does NOT exist!');
      console.log('📝 [test-db] Let\'s create it now!');
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          cne VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          is_read TINYINT(1) DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await db.query(createTableSQL);
      console.log('✅ [test-db] Table created successfully!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ [test-db] Database test failed:', error);
    process.exit(1);
  }
}

testDatabase();
