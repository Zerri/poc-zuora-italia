// File: server/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET - Ottieni tutti i prodotti
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('categoria');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Endpoint per importare catalogo prodotti iniziale (utile per seed database)
router.post('/import', async (req, res) => {
  try {
    const { prodotti } = req.body;
    
    if (!prodotti || !Array.isArray(prodotti)) {
      return res.status(400).json({ message: 'Formato dati non valido. È richiesto un array di prodotti.' });
    }
    
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

module.exports = router;