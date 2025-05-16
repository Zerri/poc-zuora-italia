// server/seed-product-users.js
require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');
const ProductUser = require('./models/ProductUser');

// Definisci gli utenti di test disponibili
const TEST_USERS = ['utenteA', 'utenteB', 'utenteC', 'admin'];

// Lista di ID di prodotti a cui associare gli utenti
// Questi dovrebbero corrispondere agli ID effettivi dei tuoi prodotti
const PRODUCTS = [
  { id: '8ad0912495aa414f0195ad77cd9a6a61', users: ['sales', 'touchpoint'] },
  { id: '8ad086fa95aa289f0195ad7695e571ee', users: ['sales', 'touchpoint'] },
  { id: '8ad093f795aa41380195ad7591026f51', users: ['sales', 'touchpoint'] },
  { id: '8ad0869c95aa28a50195ad7279d0774f', users: ['sales', 'touchpoint'] },
  { id: '8ad093f795aa41380195ad70db0b6eab', users: ['sales', 'touchpoint'] },
  { id: '8ad0869c95aa28a50195ad6e24c67658', users: ['sales', 'touchpoint'] },
  { id: '8ad0869c95a3ed8a0195a4b0c0d623c4', users: ['sales'] },
  { id: '8ad0869c95a3ed8a0195a4b04fd623b3', users: ['sales'] },
  { id: '8ad086fa95a3ed780195a4a2a4ea1cdd', users: ['sales'] },
  { id: '8ad086fa95a3ed780195a49f61bf1c5a', users: ['sales'] },
  { id: '8ad0912495a403b40195a474096813bc', users: [] },
  { id: '8ad0869c953bdb0701954d0fafce2655', users: [] },
  { id: '8ad0869c95911c6e0195a375aa6f1fcb', users: [] },
  { id: '8ad09124959133640195a3717c170a18', users: [] },
  { id: '8ad09124959133640195a36e552808c3', users: [] },
  { id: '8ad0869c95911c6e0195a36b5ad71b01', users: [] },
  { id: '8ad0869c95911c6e0195a36853601ab4', users: [] },
  { id: '8ad086fa95911c5d0195a366441015e7', users: [] },
  { id: '8ad09124959133640195a3638a8f06af', users: [] },
  { id: '8ad0869c95911c6e0195a3609ab71964', users: [] },
  { id: '8ad093f7959133870195a35cccfb7e97', users: [] },
  { id: '8ad0869c95911c6e0195a35866271652', users: [] },
  { id: '8ad086fa95911c5d0195a355aa7512e6', users: [] },
  { id: '8ad0869c958d2d3b019590582ae4672f', users: [] },
  { id: '8ad093f7958d56b4019590064ba0572d', users: [] },
  { id: '8ad086fa958d2d30019590018879564c', users: [] },
  { id: '8ad0869c958d2d3b01958ff788c452b2', users: [] },
  { id: '8ad0869c958d2d3b01958fee165c5075', users: [] },
  { id: '8ad0869c958d2d3b01958fe8d96a4f47', users: [] },
  { id: '8ad086fa958d2d3001958fe48e6d50b1', users: [] },
  { id: '8ad09124958d56ab01958eb3dccd2179', users: [] },
  { id: '8ad093f795754cd60195809eaf01179b', users: [] },
  { id: '8ad09124956b9a98019570cc78642af4', users: [] },
  { id: '8ad0869c953bdb0701955bcbf7c106f4', users: [] },
  { id: '8ad09124953befb201955c9322621be4', users: [] },
  { id: '8ad086fa953bdaf001955c894fe93987', users: [] },
  { id: '8ad0869c953bdb0701955c72d9992b7c', users: [] },
  { id: '8ad086fa953bdaf001955c6e183435c6', users: [] },
  { id: '8ad0869c953bdb0701955c649510291c', users: [] },
  { id: '8ad093f7953befb201955c5a56385d7f', users: [] },
  { id: '8ad0869c953bdb0701955c4e8d641acc', users: [] },
  { id: '8ad093f7953befb201955c418b0e599c', users: [] },
  { id: '8ad093f7953befb20195427649d15c53', users: [] },
  { id: '8ad09124953befb201955bc3a8f37a47', users: [] },
  { id: '8ad086fa953bdaf001955bb8a7370fbc', users: [] },
  { id: '8ad093f7953befb201955bb2ad5c15d6', users: [] },
  { id: '8ad093f7953befb201955b9a91e51232', users: [] },
  { id: '8ad09124953befb201955b8241e2549a', users: [] },
];

// Funzione per connettere al database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DATABASE_NAME
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

// Funzione per eliminare i dati esistenti e inserire nuovi dati
const seedData = async () => {
  try {
    // Elimina tutti i dati esistenti
    await ProductUser.deleteMany({});
    console.log('Dati precedenti eliminati...'.red);

    // Crea i nuovi record
    const productUserAssociations = PRODUCTS.map(product => ({
      productId: product.id,
      enabled_users: product.users
    }));

    // Inserisci i dati
    await ProductUser.insertMany(productUserAssociations);

    console.log('Dati inseriti con successo!'.green.inverse);
    return true;
  } catch (error) {
    console.error(`${error}`.red.inverse);
    return false;
  }
};

// Esegui lo script
const runScript = async () => {
  const conn = await connectDB();
  const success = await seedData();
  
  if (success) {
    console.log('Operazione completata correttamente.'.green);
  } else {
    console.log('Si sono verificati errori durante l\'operazione.'.red);
  }
  
  // Chiudi la connessione al database
  mongoose.connection.close();
  console.log('Connessione al database chiusa.'.yellow);
};

runScript();