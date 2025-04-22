// File: server/models/Customer.js
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  settore: { type: String },
  tipo: { type: String, enum: ['Cliente', 'Prospect'] },
  email: { type: String },
  ultimoContatto: { type: Date },
  valore: { type: Number },
  valoreAnnuo: { type: String }
});

module.exports = mongoose.model('Customer', CustomerSchema, 'Customers');