// server/models/Quote.js
const mongoose = require('mongoose');

//
// ────────────────────────────────────────────────────────────────────────────────
//   Schema per il contatore giornaliero (usato per generare il numero preventivo)
// ────────────────────────────────────────────────────────────────────────────────
//
const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Nome identificativo del contatore
  seq: { type: Number, default: 0 }             // Sequenza giornaliera incrementale
});

const Counter = mongoose.model('Counter', CounterSchema, 'Counters');

//
// ──────────────────────────────────────────────
//   Schema principale del preventivo (Quote)
// ──────────────────────────────────────────────
//
const QuoteSchema = new mongoose.Schema({

  // Identificatore univoco generato automaticamente
  number: { 
    type: String, 
    required: true, 
    unique: true
  },

  // Informazioni sul cliente
  customer: {
    email: { type: String },
    name: { type: String, required: true },
    sector: { type: String },
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }
  },

  // Stato del preventivo
  status: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Accepted', 'Rejected'], 
    default: 'Draft' 
  },

  // Tipologia del preventivo
  type: {
    type: String,
    enum: ['New', 'Migration'],
    default: 'New'
  },

  // Valore economico totale del preventivo
  value: { type: Number, required: true },

  // Elenco dei prodotti associati
  products: [{
    id: { type: String },
    name: { type: String },
    price: { type: Number },
    customerPrice: { type: Number },
    quantity: { type: Number, default: 1 },
    category: { type: String },
    description: { type: String },
    // Informazioni sul rate plan
    ratePlan: {
      id: { type: String },
      name: { type: String },
      description: { type: String }
    },
    // Informazioni sulle charges
    charges: [{
      id: { type: String },
      name: { type: String },
      type: { type: String },
      model: { type: String },
      value: { type: Number },
      calculatedPrice: { type: Number }
    }]
  }],
  // Note testuali aggiuntive
  notes: { type: String },

  // Data di validità del preventivo
  validityDate: { type: Date },

  // Data di inizio della garanzia
  warrantyStartDate: { type: Date },

  // Mesi di preavviso prima della cancellazione
  cancellationNoticeMonths: { type: Number },

  // Frequenza della fatturazione (es. "Mensile", "Annuale")
  billingFrequency: { type: String },

  // Flag per il rinnovo automatico
  renewable: { type: Boolean, default: false },

  // Flag per indicare adeguamento ISTAT
  istat: { type: Boolean, default: false },

  // Flag per blocco del prezzo
  priceBlocked: { type: Boolean, default: false }

}, { timestamps: true }); // Aggiunge automaticamente createdAt e updatedAt

//
// ────────────────────────────────────────────────────────
//   Middleware per generazione automatica del numero
// ────────────────────────────────────────────────────────
//
QuoteSchema.pre('validate', async function(next) {
  if (this.isNew && !this.number) {
    try {
      const now = new Date();
      const dateString = now.getFullYear().toString() +
                         (now.getMonth() + 1).toString().padStart(2, '0') +
                         now.getDate().toString().padStart(2, '0');

      const typeCode = this.type === 'New' ? 'NEW' : 'MIG';
      const counterName = `quote-${typeCode}-${dateString}`;

      const counter = await Counter.findOneAndUpdate(
        { name: counterName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

      this.number = `Q-${typeCode}-${dateString}-${counter.seq.toString().padStart(3, '0')}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

//
// ──────────────────────────────────────────────
//   Esportazione del modello Quote
// ──────────────────────────────────────────────
//
module.exports = mongoose.model('Quote', QuoteSchema, 'Quotes');
