const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use(limiter);

// Basic test route
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to RentalKE API' 
  });
});

// Health check route
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      success: true,
      status: 'OK', 
      message: 'Server is running',
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      status: 'Error', 
      message: 'Server is running but database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/v1/admin', require('./src/routes/admin.routes'));
app.use('/api/v1/manager', require('./src/routes/manager.routes'));
app.use('/api/v1/client', require('./src/routes/client.routes'));
app.use('/api/v1/properties', require('./src/routes/property.routes'));
app.use('/api/v1/properties/upload-images', require('./src/routes/property.routes'));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

module.exports = app;