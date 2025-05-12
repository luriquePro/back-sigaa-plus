import { toPascalCase } from '../../utils/toPascalCase.ts';

const generateRouteTemplate = (entityName: string): string => {
  const PascalName = toPascalCase(entityName);

  return [
    "import { Router } from 'express';",
    '',
    `import { ${PascalName}Controller } from '../controllers/${entityName}.controller.ts';`,
    "import { RateLimit } from '../middlewares/RateLimit.middleware.ts';",
    `import { ${PascalName}Usecase } from '../usecases/${entityName}/${entityName}.usecase.ts';`,
    '',
    `const ${entityName}Routes = Router();`,
    `const ${entityName}Usecase = new ${PascalName}Usecase();`,
    `const ${entityName}Controller = new ${PascalName}Controller(${entityName}Usecase);`,
    '',
    `${entityName}Routes.post('/', RateLimit({}), ${entityName}Controller.create.bind(${entityName}Controller));`,
    `${entityName}Routes.get('/', RateLimit({}), ${entityName}Controller.getAll.bind(${entityName}Controller));`,
    `${entityName}Routes.get('/:id', RateLimit({}), ${entityName}Controller.get.bind(${entityName}Controller));`,
    `${entityName}Routes.patch('/:id', RateLimit({}), ${entityName}Controller.update.bind(${entityName}Controller));`,
    `${entityName}Routes.delete('/:id', RateLimit({}), ${entityName}Controller.delete.bind(${entityName}Controller));`,
    '',
    `export { ${entityName}Routes };`,
    '',
  ].join('\n');
};

export { generateRouteTemplate };
