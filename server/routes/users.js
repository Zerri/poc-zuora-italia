// File: server/routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET - Ottieni tutti gli utenti con paginazione, filtri e ordinamento
router.get('/', async (req, res) => {
  try {
    // Costruzione filtri
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.role) filter.role = req.query.role;
    
    // Gestisci sia 'search' che 'searchTerm' per compatibilità
    const searchTerm = req.query.searchTerm || req.query.search;
    if (searchTerm) {
      // Decodifica automaticamente il termine di ricerca (Express lo fa automaticamente)
      const decodedSearchTerm = decodeURIComponent(searchTerm);
      
      // Verifica se il termine sembra un ObjectId MongoDB
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(decodedSearchTerm);
      
      // Costruisci il filtro di ricerca
      const searchFilters = [
        { fullName: { $regex: decodedSearchTerm, $options: 'i' } },
        { email: { $regex: decodedSearchTerm, $options: 'i' } }
      ];
      
      // Se sembra un ObjectId, aggiungi anche la ricerca per _id
      if (isObjectId) {
        searchFilters.push({ _id: decodedSearchTerm });
      }
      
      filter.$or = searchFilters;
    }

    // 🆕 GESTIONE ORDINAMENTO SERVER-SIDE per Cosmos DB
    let sortOptions = {};
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      
      // ✅ CAMPI SUPPORTATI PER ORDINAMENTO (basati sugli indici Cosmos DB)
      const allowedSortFields = {
        'id': '_id',                          // ✅ Sempre indicizzato (UNIQUE)
        'name': 'fullName',                   // ✅ Indicizzato (fullName_1)
        'email': 'email',                     // ✅ Indicizzato (email_1)
        'status': 'status',                   // ✅ Indicizzato (status_1)
        'role': 'role',                       // ✅ Indicizzato (role_1)
        'registrationDate': 'registrationDate', // ✅ Indicizzato (registrationDate_1)
        'createdAt': 'createdAt',             // ✅ Indicizzato (createdAt_1)
        'lastAccess': 'lastAccess'            // ✅ Indicizzato (lastAccess_1)
      };
      
      // Verifica se il campo richiesto è consentito
      if (allowedSortFields[sortBy]) {
        const backendField = allowedSortFields[sortBy];
        sortOptions[backendField] = sortOrder;
        console.log(`✅ Ordinamento applicato: ${sortBy} (${backendField}) ${sortOrder === 1 ? 'ASC' : 'DESC'}`);
      } else {
        console.warn(`⚠️ Campo '${sortBy}' non indicizzato, uso ordinamento default`);
        // Fallback a ordinamento sicuro
        sortOptions._id = -1;
      }
    } else {
      // Default: ordina per registrationDate (più recenti prima)
      sortOptions.registrationDate = -1;
    }

    // Se noPagination=true => restituisci tutti i risultati senza paginazione
    if (req.query.noPagination === 'true') {
      const users = await User.find(filter)
        .sort(sortOptions);  // 🆕 Ordinamento anche senza paginazione
      return res.json({ items: users });
    }

    // Altrimenti, applica paginazione + ordinamento
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort(sortOptions)  // 🆕 ORDINAMENTO SERVER-SIDE
      .skip(skip)
      .limit(limit);

    res.json({
      items: users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      },
      // 🆕 Includi info ordinamento nella risposta per debug
      sorting: {
        sortBy: req.query.sortBy || 'registrationDate',
        sortOrder: req.query.sortOrder || 'desc'
      }
    });
  } catch (error) {
    console.error('Errore nella ricerca utenti:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET - Ottieni un utente specifico per ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.json(user);
  } catch (error) {
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID utente non valido' });
    }
    res.status(500).json({ message: error.message });
  }
});

// POST - Crea un nuovo utente
router.post('/', async (req, res) => {
  try {
    // Crea nuovo utente con i dati dal body
    const userData = {
      fullName: req.body.fullName,
      email: req.body.email,
      role: req.body.role || 'User',
      status: req.body.status || 'Pending',
      avatar: req.body.avatar || null
    };
    
    // Se viene fornita una registrationDate specifica (utile per seed)
    if (req.body.registrationDate) {
      userData.registrationDate = req.body.registrationDate;
    }
    if (req.body.lastAccess) {
      userData.lastAccess = req.body.lastAccess;
    }
    
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    
    res.status(201).json(savedUser);
  } catch (error) {
    // Gestione errore duplicato email
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email già esistente' });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT - Aggiorna un utente esistente
router.put('/:id', async (req, res) => {
  try {
    // Campi aggiornabili
    const updateData = {};
    
    if (req.body.fullName !== undefined) updateData.fullName = req.body.fullName;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.role !== undefined) updateData.role = req.body.role;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar;
    if (req.body.lastAccess !== undefined) updateData.lastAccess = req.body.lastAccess;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, // Ritorna il documento aggiornato
        runValidators: true // Esegue le validazioni dello schema
      }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    // Gestione errore duplicato email
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email già esistente' });
    }
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID utente non valido' });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Elimina un utente
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.json({ 
      message: 'Utente eliminato con successo',
      user: user
    });
  } catch (error) {
    // Se l'ID non è valido come ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID utente non valido' });
    }
    res.status(500).json({ message: error.message });
  }
});

// PATCH - Aggiorna lo status di un utente
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status è richiesto' });
    }
    
    if (!['Active', 'Inactive', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Status non valido' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.json({
      message: 'Status aggiornato con successo',
      user: updatedUser
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID utente non valido' });
    }
    res.status(500).json({ message: error.message });
  }
});

// PATCH - Aggiorna l'ultimo accesso di un utente
router.patch('/:id/access', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { lastAccess: new Date() },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    res.json({
      message: 'Ultimo accesso aggiornato',
      user: updatedUser
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'ID utente non valido' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;