const pool = require('../config/database');

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(15),
        email VARCHAR(255),
        linked_id INTEGER REFERENCES contact(id),
        link_precedence VARCHAR(10) CHECK (link_precedence IN ('primary', 'secondary')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP WITH TIME ZONE
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

module.exports = initializeDatabase; 