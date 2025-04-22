// File: server/routes/stats.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Product = require('../models/Product');

// GET - Ottieni statistiche degli items
router.get('/items', async (req, res) => {
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

// GET - Ottieni statistiche sui prodotti
router.get('/products', async (req, res) => {
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

module.exports = router;