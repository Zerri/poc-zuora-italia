// File: server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Aggiungo path per gestire percorsi file

// Configurazione variabili d'ambiente
dotenv.config();

// Inizializzazione express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connessione MongoDB Cosmos DB
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DATABASE_NAME,
  retryWrites: false,
  connectTimeoutMS: 10000, // Timeout di connessione più lungo per Azure Cosmos DB
  socketTimeoutMS: 30000,  // Timeout di socket più lungo per le operazioni
})
  .then(() => console.log('MongoDB Cosmos DB connected successfully'))
  .catch(err => console.error('MongoDB Cosmos DB connection error:', err));

// Definizione modello di esempio per IT SOLUTIONS POC
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', ItemSchema);

// Definizione modello Customer
const CustomerSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  settore: { type: String },
  tipo: { type: String, enum: ['Cliente', 'Prospect'] },
  email: { type: String },
  ultimoContatto: { type: Date },
  valore: { type: Number },
  valoreAnnuo: { type: String }
});

const Customer = mongoose.model('Customer', CustomerSchema, 'Customers'); // 'Customers' è il nome della collezione in MongoDB

// API Routes
// GET - Ottieni statistiche degli items
app.get('/api/stats', async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const categoryCounts = await Item.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const avgRating = await Item.aggregate([
      { $group: { _id: null, average: { $avg: "$rating" } } }
    ]);
    
    const inStockCount = await Item.countDocuments({ inStock: true });
    
    res.json({
      totalItems,
      categoryCounts,
      avgRating: avgRating.length > 0 ? avgRating[0].average : 0,
      inStockCount,
      outOfStockCount: totalItems - inStockCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni tutti gli items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crea un nuovo item
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Ottieni tutti i clienti
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni un cliente specifico per ID
app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crea un nuovo cliente
app.post('/api/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Aggiorna un cliente esistente
app.put('/api/customers/:id', async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Elimina un cliente
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    res.json({ message: 'Cliente eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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