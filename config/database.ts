import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER||'postgres',
  password: process.env.DB_PASSWORD||'Admin@123',
  host: process.env.DB_HOST||'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
});

export default pool; 