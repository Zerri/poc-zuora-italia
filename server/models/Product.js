// File: server/models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nome: { type: String, required: true },
  descrizione: { type: String },
  categoria: { type: String, required: true },
  prezzo: { type: Number, required: true },
  caratteristiche: [{ type: String }],
  immagine: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema, 'Products');