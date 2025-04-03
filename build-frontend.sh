#!/bin/bash
# build-frontend.sh - Script per buildare il frontend e copiarlo nel backend

# Crea file .env.production con la URL API corretta
cat > client/.env.production << EOL
VITE_API_URL=/api
EOL

# Compila il frontend
echo "Compilazione del frontend React..."
cd client
npm run build
cd ..

# Copia i file buildati nel backend
echo "Copiando i file compilati nel backend..."
rm -rf server/public
mkdir -p server/public
cp -r client/dist/* server/public/

echo "Preparazione completata! Il frontend è stato buildato e integrato nel backend."