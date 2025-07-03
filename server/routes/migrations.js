// File: server/routes/migrations.js
const express = require('express');
const router = express.Router();
const Migration = require('../models/Migration');

// GET - Ottieni una migrazione specifica per subscription ID
router.get('/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    const migration = await Migration.findBySubscriptionId(subscriptionId);
    
    if (!migration) {
      return res.status(404).json({ 
        message: 'Migrazione non trovata per questo subscription ID' 
      });
    }
    
    res.json(migration);
  } catch (error) {
    console.error('Errore nel recupero migrazione:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni tutte le migrazioni
router.get('/', async (req, res) => {
  try {
    // const { customerId, status } = req.query;
    let query = {};
    
    // if (customerId) {
    //   query['customer.id'] = customerId;
    // }
    
    // if (status) {
    //   query.status = status;
    // }
    
    const migrations = await Migration.find(query);
    res.json(migrations);
  } catch (error) {
    console.error('Errore nel recupero migrazioni:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST - Crea una nuova migrazione
router.post('/', async (req, res) => {
  try {
    const migrationData = req.body;
    
    // Validazione base
    if (!migrationData.subscriptionId) {
      return res.status(400).json({ 
        message: 'subscriptionId è richiesto' 
      });
    }
    
    // Controlla se esiste già una migrazione per questo subscription
    const existingMigration = await Migration.findBySubscriptionId(migrationData.subscriptionId);
    if (existingMigration) {
      return res.status(409).json({ 
        message: 'Esiste già una migrazione per questo subscription ID' 
      });
    }
    
    const newMigration = new Migration(migrationData);
    const savedMigration = await newMigration.save();
    
    res.status(201).json(savedMigration);
  } catch (error) {
    console.error('Errore nella creazione migrazione:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dati non validi', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// PUT - Aggiorna una migrazione esistente
router.put('/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const updateData = req.body;
    
    const updatedMigration = await Migration.findOneAndUpdate(
      { subscriptionId },
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!updatedMigration) {
      return res.status(404).json({ 
        message: 'Migrazione non trovata per questo subscription ID' 
      });
    }
    
    res.json(updatedMigration);
  } catch (error) {
    console.error('Errore nell\'aggiornamento migrazione:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dati non validi', 
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// PATCH - Aggiorna lo status di una migrazione
router.patch('/:subscriptionId/status', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ 
        message: 'Status è richiesto' 
      });
    }
    
    const updateData = { status };
    if (notes) {
      updateData.notes = notes;
    }
    
    const updatedMigration = await Migration.findOneAndUpdate(
      { subscriptionId },
      updateData,
      { new: true }
    );
    
    if (!updatedMigration) {
      return res.status(404).json({ 
        message: 'Migrazione non trovata per questo subscription ID' 
      });
    }
    
    res.json({
      subscriptionId: updatedMigration.subscriptionId,
      status: updatedMigration.status,
      updatedAt: updatedMigration.updatedAt
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento status:', error);
    res.status(500).json({ message: error.message });
  }
});

// PATCH - Seleziona un percorso di migrazione
router.patch('/:subscriptionId/select-path', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { selectedPath } = req.body;
    
    if (!selectedPath || !['saas', 'iaas'].includes(selectedPath)) {
      return res.status(400).json({ 
        message: 'selectedPath deve essere "saas" o "iaas"' 
      });
    }
    
    const updatedMigration = await Migration.findOneAndUpdate(
      { subscriptionId },
      { selectedPath, status: 'pending' },
      { new: true }
    );
    
    if (!updatedMigration) {
      return res.status(404).json({ 
        message: 'Migrazione non trovata per questo subscription ID' 
      });
    }
    
    res.json({
      subscriptionId: updatedMigration.subscriptionId,
      selectedPath: updatedMigration.selectedPath,
      status: updatedMigration.status,
      updatedAt: updatedMigration.updatedAt
    });
  } catch (error) {
    console.error('Errore nella selezione percorso:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Elimina una migrazione
router.delete('/:subscriptionId', async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    
    const deletedMigration = await Migration.findOneAndDelete({ subscriptionId });
    
    if (!deletedMigration) {
      return res.status(404).json({ 
        message: 'Migrazione non trovata per questo subscription ID' 
      });
    }
    
    res.json({ 
      message: 'Migrazione eliminata con successo',
      subscriptionId 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione migrazione:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Statistiche sulle migrazioni
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Migration.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCurrentValue: { $sum: '$summary.currentCustomerValue' },
          avgCurrentValue: { $avg: '$summary.currentCustomerValue' }
        }
      }
    ]);
    
    const totalCount = await Migration.countDocuments();
    
    res.json({
      totalMigrations: totalCount,
      statusBreakdown: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore nel calcolo statistiche:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;