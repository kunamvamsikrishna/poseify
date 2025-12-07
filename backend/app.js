const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Database connections
const { connectMongoDB } = require('./db/mongo');
const { sequelize } = require('./db/sql');

// Cron jobs
const { startCronJobs, stopCronJobs } = require('./cron/jobs');

// Middleware
const errorHandler = require('./middleware/errorHandler');

// Routes
const apiRoutes = require('./routes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database connections
const initializeDatabases = async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();
    console.log('✓ MongoDB connected successfully');

    // Connect to SQL database
    await sequelize.authenticate();
    console.log('✓ SQL Database connected successfully');

    // Sync SQL models (use { force: false } in production)
    // Using alter: true to add new columns like user_id
    await sequelize.sync({ alter: true });
    console.log('✓ SQL Models synchronized');

    // Start cron jobs
    startCronJobs();

  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Initialize databases if this file is run directly
if (require.main === module) {
  initializeDatabases();
}

module.exports = { app, initializeDatabases, startCronJobs, stopCronJobs };
