#!/bin/bash

# Script para construir a aplicação e a imagem Docker

echo "=== 1. Instalando dependências ==="
npm ci

echo "=== 2. Executando build do TypeScript ==="
npm run build

echo "=== 3. Verificando se a pasta dist foi criada ==="
if [ ! -d "dist" ]; then
  echo "ERRO: A pasta dist não foi criada. Verifique seu script de build."
  exit 1
fi

echo "=== 4. Construindo a imagem Docker ==="
docker compose -f docker-compose-prod.yml up --build -d

echo "=== 5. Verificando a imagem criada ==="
docker images | grep node-api

echo "=== Build completo! ==="
echo "Para executar a API: Acesse a porta do seu host"