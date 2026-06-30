// config/env.js
// Central place to read environment variables so nothing is hardcoded
// anywhere else in the codebase.
require('dotenv').config();

function required(name) {
  const val = process.env[name];
  if (!val) {
    console.warn(`⚠️  Missing env var: ${name} — check your .env file.`);
  }
  return val;
}

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGO_URI: required('MONGO_URI'),
  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // SMTP / Nodemailer
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  NGO_EMAIL: required('NGO_EMAIL'),
  FROM_EMAIL: process.env.FROM_EMAIL || process.env.SMTP_USER,

  // UPI
  UPI_ID: process.env.UPI_ID || 'inamigosfoundation@upi',
  UPI_PAYEE_NAME: process.env.UPI_PAYEE_NAME || 'InAmigos Foundation',

  // CORS
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*'
};
