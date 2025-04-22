// File: server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DATABASE_NAME,
      retryWrites: false,
      connectTimeoutMS: 10000, // Timeout di connessione più lungo per Azure Cosmos DB
      socketTimeoutMS: 30000,  // Timeout di socket più lungo per le operazioni
    });
    console.log('MongoDB Cosmos DB connected successfully');
  } catch (err) {
    console.error('MongoDB Cosmos DB connection error:', err);
    process.exit(1); // Esci dall'applicazione in caso di errore di connessione
  }
};

module.exports = connectDB;