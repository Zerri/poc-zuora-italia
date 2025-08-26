const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(500).json({ error: 'Internal Server Error' });
// });

// router.get('/', (req, res) => {
//   res.status(404).json({ error: 'User not found' });
// });

// router.get('/', (req, res) => {
//   // Non rispondere mai - simula timeout
//   // (semplicemente non chiamare res.json o res.send)
// });

// router.get('/', (req, res) => {
//   res.json({ invalid: 'data' }); // Mancano campi required
// });

router.get('/', (req, res) => {
  res.json({
    "id": "user-12345",
    "name": "Mario Rossi",
    "roles": ["SALES"],
    "menu": [
      { "label": "Dashboard", "route": "/", "icon": "gauge" },
      { "label": "Quotes", "route": "/quotes", "icon": "fileInvoice" }
    ],
    "permissions": {
      "quotes": {
        "VIEW": true,
        "CREATE": true,
        "EXPORT": false,
        "DELETE": false
      },
      "customers": {
        "VIEW": true,
        "EDIT": false
      },
      "admin": {
        "USER_MANAGEMENT": false,
        "SYSTEM_SETTINGS": false
      }
    }
  });
});

module.exports = router;