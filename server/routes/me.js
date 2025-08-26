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
  const role = (req.query.role || "SALES").toUpperCase();

  if (role === "SALES") {
    return res.json({
      id: "user-67890",
      name: "Giulia Bianchi",
      roles: ["SALES"],
      menu: [
        { label: "Dashboard", route: "/", icon: "gauge" },
        { label: "Opportunità", route: "/opportunities", icon: "handshake" },
        { label: "Clienti", route: "/customers", icon: "users" }
      ],
      permissions: {
        quotes: {
          VIEW: true,
          CREATE: true,
          EXPORT: true,
          DELETE: false
        },
        customers: {
          VIEW: true,
          EDIT: true
        },
        admin: {
          USER_MANAGEMENT: false,
          SYSTEM_SETTINGS: false
        }
      }
    });
  }

  // Default: ADMIN
  return res.json({
    id: "user-12345",
    name: "Mario Rossi",
    roles: ["ADMIN"],
    menu: [
      { label: "Dashboard", route: "/", icon: "gauge" },
      { label: "Quotes", route: "/quotes", icon: "fileInvoice" },
      { label: "Utenti", route: "/users", icon: "usersCog" }
    ],
    permissions: {
      quotes: {
        VIEW: true,
        CREATE: true,
        EXPORT: false,
        DELETE: true
      },
      customers: {
        VIEW: true,
        EDIT: true
      },
      admin: {
        USER_MANAGEMENT: true,
        SYSTEM_SETTINGS: true
      }
    }
  });
});


module.exports = router;