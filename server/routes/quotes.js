// server/routes/quotes.js
const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// GET - Ottieni tutte le quotes
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Filtra per stato se specificato
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }
    
    // Filtra per cliente o numero quote se c'è un termine di ricerca
    if (req.query.search) {
      query.$or = [
        { 'customer.name': { $regex: req.query.search, $options: 'i' } },
        { number: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Rimuovi il sort nella query al database
    const quotes = await Quote.find(query);
    
    // Ordina i risultati in memoria dopo averli recuperati
    quotes.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni una quote specifica per ID
router.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST - Crea una nuova quote
router.post('/', async (req, res) => {
  try {
    const newQuote = new Quote(req.body);
    const savedQuote = await newQuote.save();
    res.status(201).json(savedQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT - Aggiorna una quote esistente
router.put('/:id', async (req, res) => {
  try {
    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedQuote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json(updatedQuote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Elimina una quote
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }
    res.json({ message: 'Quote successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;