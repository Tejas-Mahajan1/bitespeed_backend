require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initializeDatabase = require('./db/init');
const contactRoutes = require('./routes/contact');

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
