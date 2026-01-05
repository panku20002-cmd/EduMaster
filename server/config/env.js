
const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Define required environment variables
const requiredEnvVars = [
  'DB_USER',
  'DB_HOST',
  'DB_NAME',
  'DB_PASSWORD',
  'DB_PORT',
  'JWT_SECRET'
];

// Validation: Check if any required variable is missing
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error('❌ CRITICAL ERROR: Missing required environment variables:');
  missingVars.forEach((key) => console.error(`   - ${key}`));
  console.error('🚀 Please create a .env file in the server directory with these values.');
  process.exit(1); // Stop server execution immediately
}

// Export structured configuration
module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '30d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*', // Lock this down in production
  }
};
