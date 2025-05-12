#!/usr/bin/env node

import { execSync } from 'child_process';
const [, , ...args] = process.argv;

const [action, ...othersArgs] = args;

if (!args.length) {
  console.error('Você precisa informar um argumento válido: gen|help');
  process.exit(1);
}

if (action === 'gen') {
  const ARTIFACTS = ['entity', 'route', 'model', 'controller', 'interface', 'repo', 'usecase'];

  const artifact = othersArgs[0];
  const selectedArtifactValues = ARTIFACTS.findIndex(a => a === artifact);
  if (selectedArtifactValues === -1) {
    console.error('Artefato inválido');
    process.exit(1);
  }

  const entityName = othersArgs[1];
  if (!entityName) {
    console.error('Entidade Invalida');
    process.exit(1);
  }

  if (selectedArtifactValues === 0) {
    const functionName = othersArgs[2];
    if (!functionName) {
      console.error('Informe o nome da função');
      console.log('Exemplo: nab gen entity User createUser');
      process.exit(1);
    }
  }

  const generateCommand = `npm run generate ${selectedArtifactValues + 1} ${othersArgs[1]} ${othersArgs[2]}`;

  try {
    // Executa o comando `npm run generate` com os argumentos fornecidos
    console.log(`Executando: ${generateCommand}`);
    execSync(generateCommand, { stdio: 'inherit' });
  } catch (error) {
    console.error('Erro ao executar o comando de geração:', error.message);
    process.exit(1);
  }
}
