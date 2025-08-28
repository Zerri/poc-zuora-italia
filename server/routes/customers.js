// server/routes/customers.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET - Ottieni tutti i clienti con paginazione e filtri
router.get('/', async (req, res) => {
  try {
    // Costruzione filtri
    const filter = {};
    
    // Filtro per tipo (Cliente, Prospect, etc.)
    if (req.query.tipo && req.query.tipo !== 'All') {
      filter.tipo = req.query.tipo;
    }
    
    // Filtro per settore
    if (req.query.settore && req.query.settore !== 'All') {
      filter.settore = req.query.settore;
    }
    
    // Filtro per ricerca (nome, settore, email)
    if (req.query.search || req.query.searchTerm) {
      const searchValue = req.query.search || req.query.searchTerm;
      filter.$or = [
        { nome: { $regex: searchValue, $options: 'i' } },
        { settore: { $regex: searchValue, $options: 'i' } },
        { email: { $regex: searchValue, $options: 'i' } }
      ];
    }
    
    // Filtro per range di valore
    if (req.query.minValue || req.query.maxValue) {
      filter.valore = {};
      if (req.query.minValue) filter.valore.$gte = parseFloat(req.query.minValue);
      if (req.query.maxValue) filter.valore.$lte = parseFloat(req.query.maxValue);
    }
    
    // Filtro per data ultimo contatto
    if (req.query.dateFrom || req.query.dateTo) {
      filter.ultimoContatto = {};
      if (req.query.dateFrom) filter.ultimoContatto.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filter.ultimoContatto.$lte = new Date(req.query.dateTo);
    }

    // Filtro per stato migrabile (booleano)
    if (req.query.migrabile !== undefined && req.query.migrabile !== 'All') {
      filter.migrabile = req.query.migrabile === 'true';
    }

    // Ordinamento (default per ultimo contatto decrescente)
    let sortOptions = { ultimoContatto: -1 };
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      
      // Mappa i campi di ordinamento ai campi del database
      const sortFieldMapping = {
        'nome': 'nome',
        'tipo': 'tipo',
        'settore': 'settore',
        'email': 'email',
        'valore': 'valore',
        'ultimoContatto': 'ultimoContatto',
        'valoreAnnuo': 'valore', // Usa il valore numerico per l'ordinamento
        'migrabile': 'migrabile'
      };
      
      const dbSortField = sortFieldMapping[sortBy] || sortBy;
      sortOptions = { [dbSortField]: sortOrder };
    }

    // RETROCOMPATIBILITÀ: Se non ci sono parametri di paginazione, restituisci il formato vecchio
    const hasAnyPaginationParam = req.query.page || req.query.limit || req.query.noPagination;
    
    if (!hasAnyPaginationParam) {
      // Comportamento originale: restituisce direttamente l'array
      const customers = await Customer.find(filter).sort(sortOptions);
      return res.json(customers);
    }

    // Se noPagination=true => restituisci tutti i risultati senza paginazione (nuovo formato)
    if (req.query.noPagination === 'true') {
      const customers = await Customer.find(filter).sort(sortOptions);
      return res.json({ 
        items: customers,
        total: customers.length 
      });
    }

    // Altrimenti, applica paginazione (nuovo formato)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      items: customers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      sorting: {
        sortBy: req.query.sortBy || 'ultimoContatto',
        sortOrder: req.query.sortOrder || 'desc'
      }
    });
  } catch (error) {
    console.error('Errore nel recupero customers:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni un cliente specifico per ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    
    res.json(customer);
  } catch (error) {
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID cliente non valido' });
    }
    console.error('Errore nel recupero cliente:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Crea un nuovo cliente
router.post('/', async (req, res) => {
  try {
    // Validazione dati obbligatori
    const { nome, tipo, settore } = req.body;
    
    if (!nome || nome.trim().length === 0) {
      return res.status(400).json({ message: 'Nome cliente è richiesto' });
    }
    
    if (!tipo) {
      return res.status(400).json({ message: 'Tipo cliente è richiesto' });
    }
    
    if (!settore) {
      return res.status(400).json({ message: 'Settore è richiesto' });
    }
    
    // Crea nuovo cliente con i dati dal body
    const customerData = {
      nome: nome.trim(),
      tipo,
      settore,
      email: req.body.email || '',
      ultimoContatto: req.body.ultimoContatto || new Date(),
      valore: req.body.valore || 0,
      valoreAnnuo: req.body.valoreAnnuo || `€${req.body.valore || 0}/anno`,
      migrabile: req.body.migrabile || false,
      subscriptionId: req.body.subscriptionId || ''
    };
    
    const newCustomer = new Customer(customerData);
    const savedCustomer = await newCustomer.save();
    
    console.log(`Nuovo cliente creato: ${savedCustomer.nome}`);
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Errore nella creazione cliente:', error);
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

// PUT - Aggiorna un cliente esistente
router.put('/:id', async (req, res) => {
  try {
    // Campi aggiornabili
    const updateData = {};
    
    if (req.body.nome !== undefined) updateData.nome = req.body.nome.trim();
    if (req.body.tipo !== undefined) updateData.tipo = req.body.tipo;
    if (req.body.settore !== undefined) updateData.settore = req.body.settore;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.ultimoContatto !== undefined) updateData.ultimoContatto = req.body.ultimoContatto;
    if (req.body.valore !== undefined) {
      updateData.valore = req.body.valore;
      updateData.valoreAnnuo = `€${req.body.valore}/anno`;
    }
    if (req.body.migrabile !== undefined) updateData.migrabile = req.body.migrabile;
    if (req.body.subscriptionId !== undefined) updateData.subscriptionId = req.body.subscriptionId;
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, // Ritorna il documento aggiornato
        runValidators: true // Esegue le validazioni dello schema
      }
    );
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    
    console.log(`Cliente aggiornato: ${updatedCustomer.nome}`);
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Errore nell\'aggiornamento cliente:', error);
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID cliente non valido' });
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

// DELETE - Elimina un cliente
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    
    console.log(`Cliente eliminato: ${customer.nome}`);
    res.json({ 
      message: 'Cliente eliminato con successo',
      customer: {
        id: customer._id,
        nome: customer.nome,
        tipo: customer.tipo
      }
    });
  } catch (error) {
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID cliente non valido' });
    }
    console.error('Errore nell\'eliminazione cliente:', error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH - Aggiorna il tipo di un cliente
router.patch('/:id/tipo', async (req, res) => {
  try {
    const { tipo } = req.body;
    
    if (!tipo) {
      return res.status(400).json({ message: 'Tipo è richiesto' });
    }
    
    if (!['Cliente', 'Prospect', 'Lead'].includes(tipo)) {
      return res.status(400).json({ message: 'Tipo non valido' });
    }
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { tipo },
      { new: true }
    );
    
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Cliente non trovato' });
    }
    
    console.log(`Tipo cliente aggiornato: ${updatedCustomer.nome} -> ${tipo}`);
    res.json({
      message: 'Tipo aggiornato con successo',
      customer: {
        id: updatedCustomer._id,
        nome: updatedCustomer.nome,
        tipo: updatedCustomer.tipo,
        updatedAt: updatedCustomer.updatedAt
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID cliente non valido' });
    }
    console.error('Errore nell\'aggiornamento tipo:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Statistiche sui clienti
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Customer.aggregate([
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalValue: { $sum: '$valore' },
          avgValue: { $avg: '$valore' },
          clientiCount: {
            $sum: { $cond: [{ $eq: ['$tipo', 'Cliente'] }, 1, 0] }
          },
          prospectCount: {
            $sum: { $cond: [{ $eq: ['$tipo', 'Prospect'] }, 1, 0] }
          },
          leadCount: {
            $sum: { $cond: [{ $eq: ['$tipo', 'Lead'] }, 1, 0] }
          },
          migrabiliCount: {
            $sum: { $cond: [{ $eq: ['$migrabile', true] }, 1, 0] }
          }
        }
      }
    ]);

    const tipoBreakdown = await Customer.aggregate([
      {
        $group: {
          _id: '$tipo',
          count: { $sum: 1 },
          totalValue: { $sum: '$valore' },
          avgValue: { $avg: '$valore' }
        }
      }
    ]);

    const settoreBreakdown = await Customer.aggregate([
      {
        $group: {
          _id: '$settore',
          count: { $sum: 1 },
          totalValue: { $sum: '$valore' },
          avgValue: { $avg: '$valore' }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {
        totalCustomers: 0,
        totalValue: 0,
        avgValue: 0,
        clientiCount: 0,
        prospectCount: 0,
        leadCount: 0,
        migrabiliCount: 0
      },
      tipoBreakdown,
      settoreBreakdown,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore nel calcolo statistiche clienti:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;