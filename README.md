# TS IT SOLUTIONS POC - Template MERN Stack

## Panoramica

Questo progetto è un template completo per Proof of Concept (PoC) che utilizza lo stack MERN (MongoDB, Express, React, Node.js) con Azure come piattaforma cloud. Include un'implementazione completa di un sistema di gestione prodotti con frontend moderno e backend API RESTful, progettato per essere facilmente personalizzabile e deployabile su Azure.

## Caratteristiche

### Frontend React moderno
- React 18 con Vite per sviluppo veloce
- React Query per la gestione dello stato remoto
- React Router per la navigazione
- Design responsive e UI professionale
- Integrazione con Vapor Design System aziendale

### Backend Express.js robusto
- API RESTful complete
- Integrazione con MongoDB Cosmos DB
- Struttura modulare e scalabile
- Endpoint per dati e statistiche

### Integrazione MongoDB/Cosmos DB
- Connessione ottimizzata per Cosmos DB
- Schema dati flessibile con Mongoose
- Seed script per popolare il DB con dati di esempio

### Deployment su Azure
- Supporto per Azure App Service
- Configurazione per Azure Cosmos DB
- Struttura single-app per deployment semplificato

### Developer Experience
- Hot Module Replacement (HMR) per sviluppo rapido
- Script NPM centralizzati
- Ambiente di sviluppo con server concorrenti

## Tecnologie utilizzate

### Frontend
- React 18
- Vite
- React Query
- React Router
- Vapor Design System
- CSS moderno

### Backend
- Node.js
- Express.js
- Mongoose
- CORS

### Database
- MongoDB
- Azure Cosmos DB (API MongoDB)

### Deployment
- Azure App Service
- Visual Studio Code Deploy Extension

## Prerequisiti

- Node.js (versione 16.x o superiore)
- npm o yarn
- Account Azure (per il deployment)
- Azure CLI o VS Code Azure Extension (per il deployment)
- MongoDB locale (opzionale per sviluppo)

## Guida rapida

### Installazione

```bash
# Clona il repository
git clone <url-repository>
cd zuora-poc

# Installa le dipendenze principali
npm install

# Installa le dipendenze per client e server
npm run install:all