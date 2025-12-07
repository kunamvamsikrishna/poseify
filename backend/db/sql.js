const { Sequelize } = require('sequelize');
require('dotenv').config();

// Choose between PostgreSQL or MySQL by setting DATABASE_TYPE in .env
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'postgres'; // 'postgres' or 'mysql'

// Build connection string
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || 'poseify';

const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Initialize Sequelize with connection string
const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ SQL Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to SQL database:', error);
    return false;
  }
};

module.exports = { sequelize, testConnection };
