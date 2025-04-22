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

// Definizione modello Product per il catalogo prodotti
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  descrizione: { type: String },
  categoria: { type: String, required: true },
  prezzo: { type: Number, required: true },
  caratteristiche: [{ type: String }],
  immagine: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema, 'Products');

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

// GET - Ottieni tutti i prodotti
app.get('/api/products', async (req, res) => {
  try {
    const { categoria, search } = req.query;
    let query = {};
    
    // Filtra per categoria se specificata
    if (categoria && categoria !== 'tutti') {
      query.categoria = categoria;
    }
    
    // Filtra per termine di ricerca se specificato
    if (search) {
      query.$or = [
        { nome: { $regex: search, $options: 'i' } },
        { descrizione: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni un prodotto specifico per ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crea un nuovo prodotto
app.post('/api/products', async (req, res) => {
  try {
    // Verifica se esiste già un prodotto con lo stesso ID
    const existingProduct = await Product.findOne({ id: req.body.id });
    if (existingProduct) {
      return res.status(400).json({ message: 'Esiste già un prodotto con questo ID' });
    }
    
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Aggiorna un prodotto esistente
app.put('/api/products/:id', async (req, res) => {
  try {
    // Aggiungi timestamp di aggiornamento
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };
    
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id }, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Elimina un prodotto
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.json({ message: 'Prodotto eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni tutte le categorie di prodotti
app.get('/api/product-categories', async (req, res) => {
  try {
    const categories = await Product.distinct('categoria');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni statistiche sui prodotti
app.get('/api/products/stats/summary', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    
    const categoryCounts = await Product.aggregate([
      { $group: { _id: "$categoria", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const priceStats = await Product.aggregate([
      { 
        $group: { 
          _id: null, 
          avgPrice: { $avg: "$prezzo" },
          minPrice: { $min: "$prezzo" },
          maxPrice: { $max: "$prezzo" }
        } 
      }
    ]);
    
    res.json({
      totalProducts,
      categoryCounts,
      priceStats: priceStats.length > 0 ? priceStats[0] : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint per importare catalogo prodotti iniziale (utile per seed database)
app.post('/api/products/import', async (req, res) => {
  try {
    const { prodotti } = req.body;
    
    if (!prodotti || !Array.isArray(prodotti)) {
      return res.status(400).json({ message: 'Formato dati non valido. È richiesto un array di prodotti.' });
    }
    
    // Rimuovi tutti i prodotti esistenti (opzionale, rimuovi questa riga se vuoi aggiungere invece di sostituire)
    // await Product.deleteMany({});
    
    // Inserisci i nuovi prodotti
    const result = await Product.insertMany(prodotti);
    
    res.status(201).json({ 
      message: 'Importazione completata con successo', 
      count: result.length 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
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