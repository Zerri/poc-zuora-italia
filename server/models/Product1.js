// File: server/models/Product1.js
const mongoose = require('mongoose');

const Product1Schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ProductCode__c: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product1', Product1Schema, 'Catalog1');
