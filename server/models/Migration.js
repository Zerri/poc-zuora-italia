// File: server/models/Migration.js
const mongoose = require('mongoose');

// Schema per i charges di un prodotto
const chargeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Recurring', 'OneTime'],
    required: true
  },
  model: {
    type: String,
    enum: ['FlatFee', 'Volume', 'PerUnit'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  calculatedPrice: {
    type: Number,
    required: true
  }
}, { _id: false });

// Schema per il rate plan
const ratePlanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  Infrastructure__c: {
    type: String,
    enum: ['On Premise', 'SAAS', 'IAAS'],
    required: true
  }
}, { _id: false });

// Schema per i prodotti
const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  customerPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  description: String,
  category: {
    type: String,
    enum: ['professional', 'enterprise', 'hr', 'cross'],
    required: true
  },
  ratePlan: {
    type: ratePlanSchema,
    required: true
  },
  charges: [chargeSchema],
  // Campo specifico per prodotti di migrazione
  replacesProductId: String
}, { _id: false });

// Schema per i percorsi di migrazione
const migrationPathSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  benefits: [String],
  totalValue: {
    type: Number,
    required: true
  },
  percentChange: String,
  products: [productSchema]
}, { _id: false });

// Schema per il summary della migrazione
const summarySchema = new mongoose.Schema({
  currentValue: {
    type: Number,
    required: true
  },
  currentCustomerValue: {
    type: Number,
    required: true
  },
  saasValue: Number,
  iaasValue: Number
}, { _id: false });

// Schema per i dati del cliente
const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true
  }
}, { _id: false });

// Schema principale per Migration
const migrationSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: customerSchema,
    required: true
  },
  sourceProducts: {
    type: [productSchema],
    required: true
  },
  migrationPaths: {
    saas: migrationPathSchema,
    iaas: migrationPathSchema
  },
  nonMigrableProductIds: [String],
  nonMigrableReasons: {
    type: Map,
    of: String
  },
  summary: summarySchema,
  // Campi aggiuntivi per tracciamento
  status: {
    type: String,
    enum: ['draft', 'pending', 'in_progress', 'completed', 'failed'],
    default: 'draft'
  },
  selectedPath: {
    type: String,
    enum: ['saas', 'iaas']
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware per aggiornare updatedAt
migrationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Metodi di istanza
migrationSchema.methods.calculateCurrentTotal = function() {
  return this.sourceProducts.reduce((total, product) => total + product.price, 0);
};

migrationSchema.methods.calculateCurrentCustomerTotal = function() {
  return this.sourceProducts.reduce((total, product) => total + product.customerPrice, 0);
};

migrationSchema.methods.getMigrationPath = function(pathType) {
  return this.migrationPaths.get(pathType);
};

// Metodi statici
migrationSchema.statics.findBySubscriptionId = function(subscriptionId) {
  return this.findOne({ subscriptionId });
};

migrationSchema.statics.findByCustomerId = function(customerId) {
  return this.find({ 'customer.id': customerId });
};

module.exports = mongoose.model('Migration', migrationSchema, 'Migrations');