import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

import { generateControllerTemplate } from './templates/controller.template.ts';
import { generateInterfaceTemplate } from './templates/interface.template.ts';
import { generateModelTemplate } from './templates/model.template.ts';
import { generateRepositoryTemplate } from './templates/repository.template.ts';
import { generateRouteTemplate } from './templates/route.template.ts';
import {
  generateUsecaseFunctionTemplate,
  generateUseCaseInterfaceTemplate,
  generateUsecaseSpecTemplate,
  generateUsecaseValidationSpecTemplate,
  generateUseCaseValidationTemplate,
} from './templates/usecase.template.ts';

/* eslint-disable no-console */

type ArtifactType = 'controller' | 'entity' | 'interface' | 'model' | 'repository' | 'route' | 'usecase';
interface Artifact {
  name: string;
  value: ArtifactType;
}

const ARTIFACTS: Artifact[] = [
  {
    name: 'Entidade',
    value: 'entity',
  },
  {
    name: 'Rota',
    value: 'route',
  },
  {
    name: 'Model',
    value: 'model',
  },
  {
    name: 'Controller',
    value: 'controller',
  },
  {
    name: 'Interface',
    value: 'interface',
  },
  {
    name: 'Repositorio',
    value: 'repository',
  },
  {
    name: 'UseCase',
    value: 'usecase',
  },
];

class EntityGenerator {
  private readonly rl: readline.Interface;
  private readonly basePath: string;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.basePath = path.resolve(process.cwd(), 'src');
  }

  public async start(data: { artifact: number; entityName: string; functionName: string }): Promise<void> {
    const artifact = ARTIFACTS[data.artifact - 1] ?? (await this.selectArtifactType());
    const entityName = data.entityName ?? (await this.prompt('Digite o nome da entidade (em camelCase):'));

    await this.generateArtifact(artifact, entityName, data.functionName);
    console.log(`✅ ${artifact.name} para ${entityName} gerado com sucesso!`);

    this.rl.close();
  }

  private prompt(question: string): Promise<string> {
    return new Promise(resolve => {
      this.rl.question(question + ' ', answer => {
        if (!answer.trim()) {
          console.log('❌ Entrada inválida. Tente novamente.');
          return this.prompt(question).then(resolve);
        }
        resolve(answer.trim());
      });
    });
  }

  private selectArtifactType(): Promise<Artifact> {
    return new Promise(resolve => {
      console.log('\nSelecione o tipo de artefato:');

      ARTIFACTS.forEach((artifact, index) => console.log(`${index + 1}. ${artifact.name}`));

      this.rl.question('Escolha o número do artefato: ', answer => {
        const index = parseInt(answer) - 1;

        const artifact = ARTIFACTS[index];
        if (!artifact) {
          console.log('❌ Seleção inválida. Tente novamente.');
          return this.selectArtifactType().then(resolve);
        }

        return resolve(artifact);
      });
    });
  }

  private async generateArtifact(artifact: Artifact, entityName: string, functionName?: string): Promise<void> {
    switch (artifact.value) {
      case 'route':
        await this.generateRoute(entityName);
        break;
      case 'model':
        await this.generateModel(entityName);
        break;
      case 'controller':
        await this.generateController(entityName);
        break;
      case 'interface':
        await this.generateInterface(entityName);
        break;
      case 'repository':
        await this.generateRepository(entityName);
        break;
      case 'usecase':
        await this.generateUseCase(entityName, functionName);
        break;
      case 'entity':
        await this.generateEntity(entityName, functionName);
        break;
    }
  }

  public async generateRoute(entityName: string): Promise<void> {
    const routeContent = generateRouteTemplate(entityName);

    const routePath = path.join(this.basePath, 'routes', `${entityName}.route.ts`);
    this.writeFile(routePath, routeContent);
  }

  public async generateModel(entityName: string): Promise<void> {
    const modelContent = generateModelTemplate(entityName);

    const modelPath = path.join(this.basePath, 'models', `${entityName}.model.ts`);
    this.writeFile(modelPath, modelContent);
  }

  public async generateController(entityName: string): Promise<void> {
    const controllerContent = generateControllerTemplate(entityName);

    const controllerPath = path.join(this.basePath, 'controllers', `${entityName}.controller.ts`);
    this.writeFile(controllerPath, controllerContent);
  }

  public async generateInterface(entityName: string): Promise<void> {
    const interfaceContent = generateInterfaceTemplate(entityName);

    const interfacePath = path.join(this.basePath, 'interfaces', `${entityName}.interface.ts`);
    this.writeFile(interfacePath, interfaceContent);
  }

  public async generateRepository(entityName: string): Promise<void> {
    const repositoryContent = generateRepositoryTemplate(entityName);

    const repositoryPath = path.join(this.basePath, 'repositories', 'mongo', `${entityName}.repository.ts`);
    this.writeFile(repositoryPath, repositoryContent);
  }

  public async generateUseCase(entityName: string, fnName?: string): Promise<void> {
    // Pedir o nome da função que irá ser usada no usecase
    const functionName = fnName ?? (await this.prompt('Digite o nome da função que irá ser usada no usecase(em camelCase):'));

    // Converter o nome da função para -_
    const functionNameKebabCase =
      functionName[0].toLocaleLowerCase() +
      functionName
        .slice(1)
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase();

    // Criar a pasta da entidade do usecase
    const usecasePath = path.join(this.basePath, 'usecases', entityName);
    if (!fs.existsSync(usecasePath)) {
      fs.mkdirSync(usecasePath, { recursive: true });
    }

    // Criar pasta da função
    const functionPath = path.join(usecasePath, functionNameKebabCase);
    if (!fs.existsSync(functionPath)) {
      fs.mkdirSync(functionPath, { recursive: true });
    }

    // Criar conteudo principal do Usecase
    const usecaseContent = generateUsecaseFunctionTemplate(entityName, functionNameKebabCase);
    const usecaseFunctionPath = path.join(functionPath, `${functionNameKebabCase}.usecase.ts`);
    this.writeFile(usecaseFunctionPath, usecaseContent);

    // Criar interface do usecase
    const usecaseInterfaceContent = generateUseCaseInterfaceTemplate(functionNameKebabCase);
    const usecaseInterfacePath = path.join(functionPath, `${functionNameKebabCase}.interface.ts`);
    this.writeFile(usecaseInterfacePath, usecaseInterfaceContent);

    // Criar validação do usecase
    const usecaseValidationContent = generateUseCaseValidationTemplate(functionNameKebabCase);
    const usecaseValidationPath = path.join(functionPath, `${functionNameKebabCase}.validation.ts`);
    this.writeFile(usecaseValidationPath, usecaseValidationContent);

    // Criar spec do usecase
    const usecaseSpecContent = generateUsecaseSpecTemplate(entityName, functionNameKebabCase);
    const usecaseSpecPath = path.join(functionPath, `${functionNameKebabCase}.spec.ts`);
    this.writeFile(usecaseSpecPath, usecaseSpecContent);

    // Criar Spec da validação do usecase
    const usecaseValidationSpecContent = generateUsecaseValidationSpecTemplate(functionNameKebabCase);
    const usecaseValidationSpecPath = path.join(functionPath, `${functionNameKebabCase}.validation.spec.ts`);
    this.writeFile(usecaseValidationSpecPath, usecaseValidationSpecContent);
  }

  public async generateEntity(entityName: string, fnName?: string): Promise<void> {
    await this.generateRoute(entityName);
    await this.generateModel(entityName);
    await this.generateController(entityName);
    await this.generateInterface(entityName);
    await this.generateRepository(entityName);
    await this.generateUseCase(entityName, fnName);
  }

  private writeFile(filePath: string, content: string): void {
    // Cria o diretório se não existir
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    // Escreve o arquivo
    fs.writeFileSync(filePath, content.trim());
  }
}
const [, , artifact, entityName, functionName] = process.argv;

// Executa o gerador
new EntityGenerator().start({ artifact: parseInt(artifact), entityName, functionName });
