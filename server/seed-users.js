// File: server/seed-users.js
require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const User = require('./models/User');

// Connessione a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DATABASE_NAME,
      retryWrites: false,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    });
    console.log('MongoDB connected successfully'.green.bold);
  } catch (err) {
    console.error('MongoDB connection error:'.red.bold, err);
    process.exit(1);
  }
};

// Dati di esempio basati sul tuo mock
const sampleUsers = [
  {
    fullName: "Mario Rossi",
    email: "mario.rossi@email.com",
    role: "Administrator",
    status: "Active",
    registrationDate: new Date("2025-01-15T08:00:00.000Z"),
    lastAccess: new Date("2025-01-24T14:30:00.000Z"),
    avatar: null
  },
  {
    fullName: "Laura Verdi",
    email: "laura.verdi@email.com",
    role: "User",
    status: "Active",
    registrationDate: new Date("2025-01-18T09:15:00.000Z"),
    lastAccess: new Date("2025-01-23T16:45:00.000Z"),
    avatar: null
  },
  {
    fullName: "Giovanni Bianchi",
    email: "giovanni.bianchi@email.com",
    role: "Moderator",
    status: "Pending",
    registrationDate: new Date("2025-01-20T10:30:00.000Z"),
    lastAccess: null,
    avatar: null
  },
  {
    fullName: "Anna Neri",
    email: "anna.neri@email.com",
    role: "User",
    status: "Inactive",
    registrationDate: new Date("2025-01-22T11:00:00.000Z"),
    lastAccess: new Date("2025-01-15T10:20:00.000Z"),
    avatar: null
  },
  {
    fullName: "Franco Colombo",
    email: "franco.colombo@email.com",
    role: "User",
    status: "Active",
    registrationDate: new Date("2025-01-25T12:45:00.000Z"),
    lastAccess: new Date("2025-01-22T18:10:00.000Z"),
    avatar: null
  },
  {
    fullName: "Silvia Gialli",
    email: "silvia.gialli@email.com",
    role: "Moderator",
    status: "Active",
    registrationDate: new Date("2025-02-01T08:30:00.000Z"),
    lastAccess: new Date("2025-01-24T09:15:00.000Z"),
    avatar: null
  },
  {
    fullName: "Roberto Blu",
    email: "roberto.blu@email.com",
    role: "User",
    status: "Pending",
    registrationDate: new Date("2025-02-10T14:20:00.000Z"),
    lastAccess: null,
    avatar: null
  },
  // Aggiungiamo alcuni utenti extra per testare la paginazione
  {
    fullName: "Paola Viola",
    email: "paola.viola@email.com",
    role: "User",
    status: "Active",
    registrationDate: new Date("2025-02-12T10:00:00.000Z"),
    lastAccess: new Date("2025-01-24T15:30:00.000Z"),
    avatar: null
  },
  {
    fullName: "Marco Arancioni",
    email: "marco.arancioni@email.com",
    role: "User",
    status: "Active",
    registrationDate: new Date("2025-02-14T11:30:00.000Z"),
    lastAccess: new Date("2025-01-23T14:20:00.000Z"),
    avatar: null
  },
  {
    fullName: "Giulia Rosa",
    email: "giulia.rosa@email.com",
    role: "Moderator",
    status: "Active",
    registrationDate: new Date("2025-02-15T09:00:00.000Z"),
    lastAccess: new Date("2025-01-24T16:00:00.000Z"),
    avatar: null
  },
  {
    fullName: "Alessandro Marrone",
    email: "alessandro.marrone@email.com",
    role: "User",
    status: "Inactive",
    registrationDate: new Date("2025-02-16T13:45:00.000Z"),
    lastAccess: new Date("2025-01-10T09:30:00.000Z"),
    avatar: null
  },
  {
    fullName: "Valentina Azzurri",
    email: "valentina.azzurri@email.com",
    role: "Administrator",
    status: "Active",
    registrationDate: new Date("2025-02-18T08:15:00.000Z"),
    lastAccess: new Date("2025-01-24T17:45:00.000Z"),
    avatar: null
  }
];

// Funzione per popolare il database
const seedDatabase = async () => {
  try {
    // Connetti al database
    await connectDB();

    // Elimina i dati esistenti
    await User.deleteMany({});
    console.log('Dati utenti precedenti eliminati'.yellow);

    // Inserisci i nuovi dati
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`${createdUsers.length} utenti inseriti nel database`.green.bold);

    // Mostra statistiche
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          administrators: {
            $sum: { $cond: [{ $eq: ['$role', 'Administrator'] }, 1, 0] }
          },
          moderators: {
            $sum: { $cond: [{ $eq: ['$role', 'Moderator'] }, 1, 0] }
          },
          users: {
            $sum: { $cond: [{ $eq: ['$role', 'User'] }, 1, 0] }
          }
        }
      }
    ]);

    if (stats.length > 0) {
      console.log('\n📊 Statistiche Database:'.cyan.bold);
      console.log(`   Totale utenti: ${stats[0].totalUsers}`.cyan);
      console.log(`   Utenti attivi: ${stats[0].activeUsers}`.green);
      console.log(`   Amministratori: ${stats[0].administrators}`.yellow);
      console.log(`   Moderatori: ${stats[0].moderators}`.blue);
      console.log(`   Utenti standard: ${stats[0].users}`.white);
    }

    // Mostra alcuni utenti di esempio
    console.log('\n👥 Primi 3 utenti inseriti:'.cyan.bold);
    const firstUsers = await User.find().limit(3).select('fullName email role status');
    firstUsers.forEach(user => {
      console.log(`   - ${user.fullName} (${user.email}) - ${user.role} - ${user.status}`.white);
    });

    console.log('\n✅ Operazione completata con successo'.green.bold);
  } catch (error) {
    console.error('Errore durante il popolamento del database:'.red.bold, error);
  } finally {
    // Chiudi la connessione
    await mongoose.disconnect();
    console.log('Connessione MongoDB chiusa'.yellow);
    process.exit(0);
  }
};

// Esegui il popolamento
seedDatabase();