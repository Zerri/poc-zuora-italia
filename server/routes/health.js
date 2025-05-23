// server/routes/health.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// GET - Health check generale
router.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET - Informazioni dettagliate sul database
router.get('/database', async (req, res) => {
  try {
    // Verifica stato connessione MongoDB
    const connectionState = mongoose.connection.readyState;
    const stateNames = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Ottieni informazioni sulla connessione
    const connectionInfo = {
      status: stateNames[connectionState] || 'unknown',
      database: mongoose.connection.db?.databaseName || process.env.DATABASE_NAME,
      host: mongoose.connection.host || 'unknown',
      port: mongoose.connection.port || 'unknown',
      readyState: connectionState
    };

    // Aggiungi informazioni aggiuntive se connesso
    if (connectionState === 1) {
      // Test di connessione con ping
      await mongoose.connection.db.admin().ping();
      
      // Ottieni stats del database
      const stats = await mongoose.connection.db.stats();
      
      connectionInfo.stats = {
        collections: stats.collections,
        documents: stats.objects,
        dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`
      };
    }

    // Determina il tipo di ambiente
    const mongoUri = process.env.MONGO_URI || '';
    let environment = 'unknown';
    
    if (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
      environment = 'local';
    } else if (mongoUri.includes('cosmos.azure.com')) {
      environment = 'azure';
    } else if (mongoUri.includes('mongodb.net')) {
      environment = 'atlas';
    }

    res.json({
      ...connectionInfo,
      environment,
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV || 'development'
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET - Verifica collezioni principali
router.get('/collections', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: 'error',
        message: 'Database not connected'
      });
    }

    // Lista delle collezioni principali
    const collections = ['Customers', 'Catalog1', 'ProductUsers', 'Quotes', 'Items'];
    const collectionStats = {};

    for (const collectionName of collections) {
      try {
        const collection = mongoose.connection.db.collection(collectionName);
        const count = await collection.countDocuments();
        collectionStats[collectionName] = {
          exists: true,
          count: count
        };
      } catch (error) {
        collectionStats[collectionName] = {
          exists: false,
          error: error.message
        };
      }
    }

    res.json({
      status: 'ok',
      database: mongoose.connection.db.databaseName,
      collections: collectionStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;