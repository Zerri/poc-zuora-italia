const express = require('express');
const router = express.Router();
const Product1 = require('../models/Product1');
const ProductUser = require('../models/ProductUser');

// GET - Ottieni tutti i prodotti, con filtro opzionale per utente
router.get('/', async (req, res) => {
  try {
    const { category, search, userId } = req.query;
    let query = {};
    
    // Filtro per categoria
    if (category && category !== 'tutti') {
      query.category = category;
    }

    // Filtro per testo di ricerca
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtro per utente (novità)
    if (userId && userId !== 'admin') {
      // Per tutti gli utenti eccetto admin, filtra in base alle autorizzazioni
      const userProducts = await ProductUser.find({ 
        enabled_users: userId 
      });
      
      // Estrai gli ID dei prodotti abilitati
      const productIds = userProducts.map(up => up.productId);
      
      // Se c'è un userId specificato ma non ci sono prodotti abilitati per lui,
      // restituisce un array vuoto (nessuna corrispondenza possibile)
      if (productIds.length === 0) {
        return res.json([]);
      }
      
      // Aggiungi il filtro per ID dei prodotti alla query
      query.id = { $in: productIds };
    }
    // Se userId è 'admin' o non è specificato, non applicare filtri basati sull'utente
    // L'admin può vedere tutti i prodotti

    // Esegui la query con tutti i filtri impostati
    const products = await Product1.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni un prodotto specifico per ID
router.get('/:id', async (req, res) => {
  try {
    const { userId } = req.query; // Opzionale: controlla l'accesso dell'utente
    const productId = req.params.id;
    
    // Se è stato fornito un userId diverso da 'admin', verifica se l'utente ha accesso a questo prodotto
    if (userId && userId !== 'admin') {
      const userProduct = await ProductUser.findOne({
        productId: productId,
        enabled_users: userId
      });
      
      // Se l'utente non ha accesso al prodotto, restituisci un errore 403
      if (!userProduct) {
        return res.status(403).json({ message: 'Utente non autorizzato ad accedere a questo prodotto' });
      }
    }
    // L'admin ha accesso a tutti i prodotti, quindi salta il controllo

    const product = await Product1.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
