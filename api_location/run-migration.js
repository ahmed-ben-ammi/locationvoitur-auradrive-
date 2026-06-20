const db = require('./config/db');

async function runMigration() {
  try {
    console.log('🔍 Running migration...');
    
    // First, check if prix_par_jour column already exists
    const [checkPrix] = await db.query(`
      SHOW COLUMNS FROM voitures LIKE 'prix_par_jour'
    `);
    
    if (checkPrix.length === 0) {
      console.log('⚠️  Column prix_par_jour not found, adding...');
      await db.query(`
        ALTER TABLE voitures ADD COLUMN prix_par_jour DECIMAL(10,2) DEFAULT 500.00
      `);
      console.log('✅ Added prix_par_jour column!');
      
      // Update existing cars
      await db.query(`
        UPDATE voitures SET prix_par_jour = 250 WHERE id = 1
      `);
      await db.query(`
        UPDATE voitures SET prix_par_jour = 450 WHERE id = 2
      `);
      await db.query(`
        UPDATE voitures SET prix_par_jour = 750 WHERE id = 3
      `);
      console.log('✅ Updated existing cars with prices!');
    } else {
      console.log('✅ Column prix_par_jour already exists!');
    }

    // Now, check and add columns to notifications table
    const columnsToAdd = [
      { name: 'type', type: 'VARCHAR(50)' },
      { name: 'role', type: 'VARCHAR(20)' },
      { name: 'title', type: 'VARCHAR(255)' }
    ];

    for (const column of columnsToAdd) {
      const [checkCol] = await db.query(`
        SHOW COLUMNS FROM notifications LIKE '${column.name}'
      `);
      
      if (checkCol.length === 0) {
        console.log(`⚠️  Column ${column.name} not found in notifications, adding...`);
        await db.query(`
          ALTER TABLE notifications ADD COLUMN ${column.name} ${column.type} NULL
        `);
        console.log(`✅ Added ${column.name} column to notifications!`);
      } else {
        console.log(`✅ Column ${column.name} already exists in notifications!`);
      }
    }
    
    console.log('🎉 Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

runMigration();
