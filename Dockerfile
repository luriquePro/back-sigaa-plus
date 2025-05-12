FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de package.json para instalar dependências
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm ci --only=production

COPY dist/ ./dist/

# Copia o arquivo .env da pasta build para o container
COPY build/env-production ./.env

# Expõe a porta que o servidor utilizará
EXPOSE 3000

# Define as variáveis de ambiente para produção
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "dist/server.cjs"]