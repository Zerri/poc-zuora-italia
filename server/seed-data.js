// File: server/seed-data.js
require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DATABASE_NAME,
  retryWrites: false,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
})
  .then(() => console.log('MongoDB Cosmos DB connected successfully'.green.bold))
  .catch(err => {
    console.error('MongoDB connection error:'.red.bold, err);
    process.exit(1);
  });

// Definizione schema
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', ItemSchema);

// Dati di esempio
const sampleItems = [
  {
    name: 'Abbonamento Base',
    description: 'Piano mensile con funzionalità essenziali',
    category: 'Subscription',
    price: 9.99,
    inStock: true,
    rating: 4.2
  },
  {
    name: 'Abbonamento Premium',
    description: 'Piano annuale con tutte le funzionalità avanzate e supporto prioritario',
    category: 'Subscription',
    price: 99.99,
    inStock: true,
    rating: 4.8
  },
  {
    name: 'Servizio Consulenza',
    description: 'Pacchetto di 5 ore di consulenza con un esperto',
    category: 'Service',
    price: 299.99,
    inStock: true,
    rating: 4.9
  },
  {
    name: 'Add-on Reporting',
    description: 'Modulo aggiuntivo per reportistica avanzata',
    category: 'Add-on',
    price: 5.99,
    inStock: true,
    rating: 3.7
  },
  {
    name: 'Add-on Integrazione',
    description: 'Modulo per integrare con sistemi di terze parti',
    category: 'Add-on',
    price: 7.99,
    inStock: false,
    rating: 4.5
  },
  {
    name: 'Licenza Enterprise',
    description: 'Licenza multi-utente per grandi aziende, con supporto 24/7',
    category: 'License',
    price: 999.99,
    inStock: true,
    rating: 4.6
  }
];

// Funzione per popolare il database
const seedDatabase = async () => {
  try {
    // Elimina i dati esistenti
    await Item.deleteMany({});
    console.log('Dati precedenti eliminati'.yellow);

    // Inserisci i nuovi dati
    const createdItems = await Item.insertMany(sampleItems);
    console.log(`${createdItems.length} items inseriti nel database`.green.bold);

    // Verifica i dati inseriti
    const count = await Item.countDocuments();
    console.log(`Totale documenti nel database: ${count}`.cyan);

    mongoose.disconnect();
    console.log('Operazione completata con successo'.green.bold);
  } catch (error) {
    console.error('Errore durante il popolamento del database:'.red.bold, error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Esegui il popolamento
seedDatabase();