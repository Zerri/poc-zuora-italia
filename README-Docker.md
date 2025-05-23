# Setup Docker per MongoDB

Questa guida ti aiuterà a configurare MongoDB con Docker per lo sviluppo locale.

## Prerequisiti

- Docker e Docker Compose installati sul tuo sistema
- Node.js e npm installati per l'applicazione

## File necessari

### 1. docker-compose.yml
Questo file configura MongoDB

### 2. server/.env.development
File di configurazione per l'ambiente di sviluppo con le credenziali MongoDB locali.

### 3. mongodb-init/01-init.js
Script di inizializzazione del database che viene eseguito al primo avvio.

## Comandi disponibili

### Avviare MongoDB
```bash
# Avvia solo MongoDB in background
npm run docker:up

# Oppure direttamente con docker-compose
docker-compose up -d
```

### Sviluppo completo
```bash
# Avvia MongoDB e poi l'applicazione
npm run docker:dev
```

### Popolamento database
```bash
# Avvia MongoDB e popola il database con dati di test
npm run docker:seed
```

### Gestione container
```bash
# Ferma i container
npm run docker:down

# Visualizza i log di MongoDB
npm run docker:logs

# Reset completo (cancella tutti i dati)
npm run docker:reset
```

## Accesso ai servizi

### MongoDB
- **Host**: localhost
- **Porta**: 27017
- **Username**: admin
- **Password**: password123
- **Database**: zuora_poc

### Mongo Express (Interfaccia Web)
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: admin123

## Connection String

Per l'applicazione Node.js, usa questa connection string nel file `.env.development`:

```
MONGO_URI=mongodb://admin:password123@localhost:27017/zuora_poc?authSource=admin
```

## Flusso di lavoro consigliato

1. **Prima volta**:
   ```bash
   npm run docker:up
   npm run seed
   npm run dev
   ```

2. **Sviluppo quotidiano**:
   ```bash
   npm run docker:dev
   ```

3. **Reset database** (se necessario):
   ```bash
   npm run docker:reset
   npm run seed
   ```

## Risoluzione problemi

### MongoDB non si avvia
- Verifica che la porta 27017 non sia già occupata
- Controlla i log: `npm run docker:logs`

### Errori di connessione
- Assicurati che MongoDB sia avviato: `docker ps`
- Verifica la connection string nel file `.env.development`

### Dati persi
- I dati sono persistenti nel volume Docker `mongodb_data`
- Per reset completo: `npm run docker:reset`

## Struttura file

```
├── docker-compose.yml
├── mongodb-init/
│   └── 01-init.js
├── server/
│   ├── .env.development
│   └── ...
└── ...
```