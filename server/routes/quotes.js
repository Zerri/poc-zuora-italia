// server/routes/quotes.js
const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');

// GET - Ottieni tutte le quotes con paginazione e filtri
router.get('/', async (req, res) => {
  try {
    // Costruzione filtri
    const filter = {};
    
    // Filtro per stato
    if (req.query.status && req.query.status !== 'All') {
      filter.status = req.query.status;
    }
    
    // Filtro per tipo
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    // Filtro per ricerca (nome cliente o numero quote)
    if (req.query.search) {
      filter.$or = [
        { 'customer.name': { $regex: req.query.search, $options: 'i' } },
        { number: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filtro per range di valore
    if (req.query.minValue || req.query.maxValue) {
      filter.value = {};
      if (req.query.minValue) filter.value.$gte = parseFloat(req.query.minValue);
      if (req.query.maxValue) filter.value.$lte = parseFloat(req.query.maxValue);
    }
    
    // Filtro per data
    if (req.query.dateFrom || req.query.dateTo) {
      filter.createdAt = {};
      if (req.query.dateFrom) filter.createdAt.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filter.createdAt.$lte = new Date(req.query.dateTo);
    }

    // Ordinamento (default per data di creazione decrescente)
    let sortOptions = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      sortOptions = { [sortBy]: sortOrder };
    }

    // RETROCOMPATIBILITÀ: Se non ci sono parametri di paginazione, restituisci il formato vecchio
    const hasAnyPaginationParam = req.query.page || req.query.limit || req.query.noPagination;
    
    if (!hasAnyPaginationParam) {
      // Comportamento originale: restituisce direttamente l'array
      const quotes = await Quote.find(filter).sort(sortOptions);
      return res.json(quotes);
    }

    // Se noPagination=true => restituisci tutti i risultati senza paginazione (nuovo formato)
    if (req.query.noPagination === 'true') {
      const quotes = await Quote.find(filter).sort(sortOptions);
      return res.json({ items: quotes });
    }

    // Altrimenti, applica paginazione (nuovo formato)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Quote.countDocuments(filter);
    const quotes = await Quote.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      items: quotes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Errore nel recupero quotes:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni una quote specifica per ID
router.get('/:id', async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote non trovata' });
    }
    
    res.json(quote);
  } catch (error) {
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID quote non valido' });
    }
    console.error('Errore nel recupero quote:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Crea una nuova quote
router.post('/', async (req, res) => {
  try {
    // Validazione dati obbligatori
    const { customer, value, products } = req.body;
    
    if (!customer || !customer.name) {
      return res.status(400).json({ message: 'Informazioni cliente richieste' });
    }
    
    if (!value || value <= 0) {
      return res.status(400).json({ message: 'Valore quote deve essere maggiore di 0' });
    }
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Almeno un prodotto è richiesto' });
    }
    
    // Crea nuova quote con i dati dal body
    const quoteData = {
      customer,
      value,
      products,
      status: req.body.status || 'Draft',
      type: req.body.type || 'New',
      notes: req.body.notes || '',
      validityDate: req.body.validityDate,
      warrantyStartDate: req.body.warrantyStartDate,
      cancellationNoticeMonths: req.body.cancellationNoticeMonths,
      billingFrequency: req.body.billingFrequency,
      renewable: req.body.renewable || false,
      istat: req.body.istat || false,
      priceBlocked: req.body.priceBlocked || false
    };
    
    const newQuote = new Quote(quoteData);
    const savedQuote = await newQuote.save();
    
    console.log(`Nuova quote creata: ${savedQuote.number}`);
    res.status(201).json(savedQuote);
  } catch (error) {
    console.error('Errore nella creazione quote:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dati non validi', 
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT - Aggiorna una quote esistente
router.put('/:id', async (req, res) => {
  try {
    // Campi aggiornabili
    const updateData = {};
    
    if (req.body.customer !== undefined) updateData.customer = req.body.customer;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.type !== undefined) updateData.type = req.body.type;
    if (req.body.value !== undefined) updateData.value = req.body.value;
    if (req.body.products !== undefined) updateData.products = req.body.products;
    if (req.body.notes !== undefined) updateData.notes = req.body.notes;
    if (req.body.validityDate !== undefined) updateData.validityDate = req.body.validityDate;
    if (req.body.warrantyStartDate !== undefined) updateData.warrantyStartDate = req.body.warrantyStartDate;
    if (req.body.cancellationNoticeMonths !== undefined) updateData.cancellationNoticeMonths = req.body.cancellationNoticeMonths;
    if (req.body.billingFrequency !== undefined) updateData.billingFrequency = req.body.billingFrequency;
    if (req.body.renewable !== undefined) updateData.renewable = req.body.renewable;
    if (req.body.istat !== undefined) updateData.istat = req.body.istat;
    if (req.body.priceBlocked !== undefined) updateData.priceBlocked = req.body.priceBlocked;
    
    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, // Ritorna il documento aggiornato
        runValidators: true // Esegue le validazioni dello schema
      }
    );
    
    if (!updatedQuote) {
      return res.status(404).json({ message: 'Quote non trovata' });
    }
    
    console.log(`Quote aggiornata: ${updatedQuote.number}`);
    res.json(updatedQuote);
  } catch (error) {
    console.error('Errore nell\'aggiornamento quote:', error);
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID quote non valido' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dati non validi', 
        errors: Object.keys(error.errors).reduce((acc, key) => {
          acc[key] = error.errors[key].message;
          return acc;
        }, {})
      });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Elimina una quote
router.delete('/:id', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    
    if (!quote) {
      return res.status(404).json({ message: 'Quote non trovata' });
    }
    
    console.log(`Quote eliminata: ${quote.number}`);
    res.json({ 
      message: 'Quote eliminata con successo',
      quote: {
        id: quote._id,
        number: quote.number,
        customer: quote.customer
      }
    });
  } catch (error) {
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID quote non valido' });
    }
    console.error('Errore nell\'eliminazione quote:', error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH - Aggiorna lo status di una quote
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status è richiesto' });
    }
    
    if (!['Draft', 'Sent', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status non valido' });
    }
    
    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedQuote) {
      return res.status(404).json({ message: 'Quote non trovata' });
    }
    
    console.log(`Status quote aggiornato: ${updatedQuote.number} -> ${status}`);
    res.json({
      message: 'Status aggiornato con successo',
      quote: {
        id: updatedQuote._id,
        number: updatedQuote.number,
        status: updatedQuote.status,
        updatedAt: updatedQuote.updatedAt
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID quote non valido' });
    }
    console.error('Errore nell\'aggiornamento status:', error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH - Duplica una quote (crea una copia con status Draft)
router.patch('/:id/duplicate', async (req, res) => {
  try {
    const originalQuote = await Quote.findById(req.params.id);
    
    if (!originalQuote) {
      return res.status(404).json({ message: 'Quote originale non trovata' });
    }
    
    // Crea una copia della quote
    const duplicateData = {
      customer: originalQuote.customer,
      status: 'Draft', // Sempre Draft per le copie
      type: originalQuote.type,
      value: originalQuote.value,
      products: originalQuote.products,
      notes: `[COPIA] ${originalQuote.notes}`,
      validityDate: originalQuote.validityDate,
      warrantyStartDate: originalQuote.warrantyStartDate,
      cancellationNoticeMonths: originalQuote.cancellationNoticeMonths,
      billingFrequency: originalQuote.billingFrequency,
      renewable: originalQuote.renewable,
      istat: originalQuote.istat,
      priceBlocked: originalQuote.priceBlocked
    };
    
    const duplicatedQuote = new Quote(duplicateData);
    const savedDuplicate = await duplicatedQuote.save();
    
    console.log(`Quote duplicata: ${originalQuote.number} -> ${savedDuplicate.number}`);
    res.status(201).json({
      message: 'Quote duplicata con successo',
      originalQuote: originalQuote.number,
      newQuote: savedDuplicate
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID quote non valido' });
    }
    console.error('Errore nella duplicazione quote:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Statistiche sulle quotes
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: null,
          totalQuotes: { $sum: 1 },
          totalValue: { $sum: '$value' },
          avgValue: { $avg: '$value' },
          draftCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Draft'] }, 1, 0] }
          },
          sentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Sent'] }, 1, 0] }
          },
          acceptedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
          },
          newTypeCount: {
            $sum: { $cond: [{ $eq: ['$type', 'New'] }, 1, 0] }
          },
          migrationTypeCount: {
            $sum: { $cond: [{ $eq: ['$type', 'Migration'] }, 1, 0] }
          }
        }
      }
    ]);

    const statusBreakdown = await Quote.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
          avgValue: { $avg: '$value' }
        }
      }
    ]);

    const typeBreakdown = await Quote.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
          avgValue: { $avg: '$value' }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {
        totalQuotes: 0,
        totalValue: 0,
        avgValue: 0,
        draftCount: 0,
        sentCount: 0,
        acceptedCount: 0,
        rejectedCount: 0,
        newTypeCount: 0,
        migrationTypeCount: 0
      },
      statusBreakdown,
      typeBreakdown,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore nel calcolo statistiche quotes:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;