// server/models/ProductUser.js
const mongoose = require('mongoose');

const ProductUserSchema = new mongoose.Schema({
  productId: { 
    type: String, 
    required: true,
    index: true // Aggiungiamo un indice per ottimizzare le query
  },
  enabled_users: {
    type: [String], 
    default: [],
    index: true // Aggiungiamo un indice anche per gli utenti
  }
}, { timestamps: true });

// Creiamo un indice composto per le query più comuni
ProductUserSchema.index({ productId: 1, enabled_users: 1 });

module.exports = mongoose.model('ProductUser', ProductUserSchema, 'ProductUsers');