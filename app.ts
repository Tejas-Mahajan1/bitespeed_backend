import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import initializeDatabase from './db/init';
import contactRoutes from './routes/contact';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/', contactRoutes);

// Initialize database and start server
const PORT = process.env.PORT || 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }); 