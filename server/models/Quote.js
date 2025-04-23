// server/models/Quote.js
const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  number: { 
    type: String, 
    required: true, 
    unique: true 
  },
  customer: {
    name: { type: String, required: true },
    sector: { type: String },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
  },
  status: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Accepted', 'Rejected'], 
    default: 'Draft' 
  },
  type: {
    type: String,
    enum: ['New', 'Migration'],
    default: 'New'
  },
  value: { type: Number, required: true },
  date: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  products: [{
    id: { type: String },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 }
  }],
  notes: { type: String }
});

module.exports = mongoose.model('Quote', QuoteSchema, 'Quotes');