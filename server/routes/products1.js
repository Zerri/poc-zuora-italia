const express = require('express');
const router = express.Router();
const Product1 = require('../models/Product1');

// GET - Ottieni tutti i prodotti
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'tutti') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product1.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni un prodotto specifico per ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product1.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
