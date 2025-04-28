// File: server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Configurazione variabili d'ambiente
dotenv.config();

// Inizializzazione express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connessione al database MongoDB
connectDB();

// Importazione routes
const itemRoutes = require('./routes/items');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const product1Routes = require('./routes/products1');
const statsRoutes = require('./routes/stats');
const quotesRoutes = require('./routes/quotes');

// Utilizzo routes
app.use('/api/items', itemRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products1', product1Routes);
app.use('/api/stats', statsRoutes);
app.use('/api/quotes', quotesRoutes);

// API health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Serve dei file statici dalla cartella public (React build)
app.use(express.static(path.join(__dirname, 'public')));

// Il "catchall handler": per qualsiasi richiesta che non corrisponde
// alle rotte precedenti, invia il file index.html di React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Server startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});