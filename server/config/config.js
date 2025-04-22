// File: server/config/config.js
module.exports = {
  PORT: process.env.PORT || 5000,
  DATABASE_NAME: process.env.DATABASE_NAME,
  NODE_ENV: process.env.NODE_ENV || 'development'
};