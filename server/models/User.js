// File: server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  role: { 
    type: String,
    enum: ['Administrator', 'User', 'Moderator'],
    default: 'User',
    required: true
  },
  status: { 
    type: String,
    enum: ['Active', 'Inactive', 'Pending'],
    default: 'Pending',
    required: true
  },
  registrationDate: { 
    type: Date, 
    default: Date.now
  },
  lastAccess: { 
    type: Date,
    default: null
  },
  avatar: { 
    type: String,
    default: null
  }
}, { 
  timestamps: true // Aggiunge automaticamente createdAt e updatedAt
});

// Nessun indice aggiuntivo - manteniamo solo quello automatico su _id
// L'unico indice necessario è quello su email per l'unicità
UserSchema.index({ email: 1 });

// Metodo per formattare l'output JSON (rimuove __v e timestamps se non necessari)
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  return obj;
};

// Metodi statici utili
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findActive = function() {
  return this.find({ status: 'Active' });
};

module.exports = mongoose.model('User', UserSchema, 'Users');