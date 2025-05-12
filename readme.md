# API Node.js Express Boilerplate

## 📋 Visão Geral do Projeto

Este é um robusto boilerplate de API Node.js Express com TypeScript, apresentando:

- Servidor Express.js
- Integração com MongoDB
- Cache Redis
- Middleware de autenticação
- Tratamento de erros
- Limitação de taxa de requisições
- Configuração de ambiente
- Suporte a TypeScript

## 🐳 Docker

Este projeto está configurado para ser executado em Docker, facilitando a configuração do ambiente e garantindo consistência entre diferentes
sistemas.

### Requisitos para Docker

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Node.js (para compilação local)

### Construção e Execução com Docker

#### Método 1: Usando o script de automação

O script `build.sh` automatiza todo o processo:

```bash
# Dar permissão de execução
chmod +x build.sh

# Executar o script
./build.sh
```

#### Método 2: Construção manual

1. **Compilar o código TypeScript localmente**

   ```bash
   npm ci
   npm run build
   ```

2. **Construir a imagem Docker**

   ```bash
   docker build -t node-api:latest .
   ```

3. **Iniciar os serviços com Docker Compose**

   ```bash
   docker-compose up -d
   ```

### Comandos Docker úteis

- **Verificar logs**

  ```bash
  docker-compose logs -f api
  ```

- **Parar todos os contêineres**

  ```bash
  docker-compose down
  ```

- **Reiniciar um serviço específico**

  ```bash
  docker-compose restart api
  ```

- **Executar comandos dentro do contêiner**

  ```bash
  docker-compose exec api sh
  ```

- **Executar a API isoladamente**
  ```bash
  docker run -p 3000:3000 --env-file .env node-api:latest
  ```

## 🚀 Pré-requisitos (Sem Docker)

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 18+ recomendada)
- NVM
- npm ou Yarn
- MongoDB e Redis (ou use Docker Compose)

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/luriquePro/back-end-node-api-base
cd back-end-node-api-base
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` no diretório raiz com a seguinte configuração:

```env
# Configuração do Servidor
PORT=3000
NODE_ENV=development

# Configuração do MongoDB
MONGODB_URL=mongodb://localhost:27017
MONGODB_NAME=seu_nome_de_banco_de_dados

# Configuração do Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# Configuração de CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Tratamento de Erros
FORMAT_MESSAGE_ON_ERROR=true
```

4. Rode o Docker Compose

```bash
docker compose up -d
```

## 🌟 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento com recarregamento automático
- `npm run build`: Compila TypeScript para JavaScript
- `npm start`: Executa o build de produção
- `npm test`: Executa a suíte de testes
- `npm test:dev`: Executa a suíte de testes com recarregamento automático
- `npm run lint`: Executa o ESLint para verificação de qualidade de código
- `npm run generate`: Gera automaticamente artefatos da arquitetura do projeto

## 📂 Estrutura do Projeto

```
raiz-do-projeto/
│
├── src/
│   ├── controllers/     # Manipuladores de rotas
│   ├── models/          # Modelos Mongoose
│   ├── routes/          # Definições de rotas da API
│   ├── middlewares/     # Middlewares do Express
│   ├── usecases/        # Lógica de negócio
│   ├── interfaces/      # Interfaces TypeScript
│   ├── utils/           # Funções utilitárias
│   └── repositories/    # Camada de acesso a dados
│
├── tests/               # Arquivos de teste e2e
├── .env                 # Variáveis de ambiente
├── tsconfig.json        # Configuração do TypeScript
└── package.json         # Dependências e scripts do projeto
```

## 🔒 Recursos de Segurança

- Proteção CORS
- Helmet.js para proteger cabeçalhos HTTP
- Middleware de limitação de taxa de requisições
- Tratamento de erros baseado em ambiente

## 🆕 Adicionando Novos Recursos Manualmente

### Criando uma Nova Rota

1. Crie um novo arquivo de rota em `src/routes/`
2. Adicione um controlador correspondente em `src/controllers/`
3. Implemente a lógica de negócio em `src/usecases/`
4. Defina os modelos necessários em `src/models/`

### Exemplo: Adicionando um Novo Endpoint de API

```typescript
// src/routes/exemplo.route.ts
import { Router } from 'express';
import { ExemploController } from '../controllers/exemplo.controller';

const RotasExemplo = Router();
const exemploController = new ExemploController();

RotasExemplo.get('/exemplo', exemploController.obterExemplo.bind(exemploController));
```

## 🆕 Adicionando Novos Recursos com CLI

### CLI de Geração de Entidades

Este CLI ajuda a gerar rapidamente artefatos para sua API, seguindo a arquitetura do projeto.

### 🛠 Tipos de Artefatos Suportados

1. Model (model)
2. Controller (controller)
3. Route (route)
4. UseCase (usecase)
5. Interface (interface)
6. Repository (repository)
7. Entity (entity)

## Usando NPM Localmente no Projeto

```bash
npm run generate
```

### Exemplo de Fluxo

1. Digite o nome da entidade (em camelCase)
2. Escolha o tipo de artefato
3. Arquivo será gerado automaticamente na estrutura correta

## 💡 Exemplo Prático Usando BIN

Somente no primeiro uso, associe o bin ao seu projeto:

```bash

chmod +x src/bin/nab.ts
npm link

```

Gerar o Artefato

```bash
nab gen [artefato] [entidade] (função)
```

Gerar uma entidade de usuário:

```bash
npm run generate
# Tipo de artefato: model, controller, route, etc.
# Nome da entidade: user
```

ou

```bash
npm run generate 3 user

# 3 é o valor do Model
```

ou

```bash
nab gen entity user createUser
```

### 🔍 O que é Gerado

- Arquivos seguem a estrutura do projeto
- Nomes são padronizados
- Código inicial é gerado
- Fácil personalização posterior

### 🛡️ Validações O CLI valida:

- Se os argumentos foram passados corretamente
- Se o artefato é válido
- Se o nome da entidade foi informado
- Se o nome da função (no caso de entity) foi incluído

### 🐛 Tratamento de Erros Erros são tratados com mensagens claras, como:

- Você precisa informar um argumento válido: gen|help
- Artefato inválido
- Entidade inválida
- Informe o nome da função

## ⚠️ Considerações

- Siga o padrão camelCase
- Verifique os arquivos gerados
- Personalize conforme necessário

## 🧪 Testes

- Utiliza Jest para testes unitários e de integração
- Execute os testes com `npm test`
- Escreva testes e2e no diretório `tests/`
- Escreva testes unit no mesmo nivel do arquivo, usando `.spec`

## 🚧 Tratamento de Erros

A aplicação usa classes de erro personalizadas em `src/utils/apiErros.util.ts`:

- `ApiError`: Classe de erro base
- `ValidationError`: 422 Entidade Não Processável
- `BadRequestError`: 400 Requisição Inválida
- `UnauthorizedError`: 401 Não Autorizado
- `NotFoundError`: 404 Não Encontrado
- `CustomError`: Tratamento de erro personalizado flexível, para retornar até Objetos no erro

## 📝 Contribuindo

1. Faça um fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/RecursoIncrivel`)
3. Commit suas alterações (`git commit -m 'Adiciona algum RecursoIncrivel'`)
4. Faça o push para a branch (`git push origin feature/RecursoIncrivel`)
5. Abra um Pull Request

## 🔐 Variáveis de Ambiente

Certifique-se de definir todas as variáveis de ambiente necessárias no arquivo `.env`. Nunca envie informações confidenciais para o controle de
versão.

## 📌 Versão

Versão atual: 1.0.0

## 📄 Licença

[MIT](https://github.com/luriquePro/back-end-node-api-base/license)

## 🛠 Solução de Problemas

- Verifique se o MongoDB e o Redis estão em execução
- Verifique o arquivo `.env` para configuração correta
- Confirme as versões do Node.js e npm
- Execute `npm install` para resolver problemas de dependências

## 📞 Suporte

Para problemas ou dúvidas, abra uma issue no repositório no GitHub.

## 🎉 Boa Codificação!
