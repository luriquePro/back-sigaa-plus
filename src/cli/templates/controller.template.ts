import { toPascalCase } from '../../utils/to_pascal_case.ts';

const generateControllerTemplate = (entityName: string): string => {
  const PascalName = toPascalCase(entityName);

  return [
    "import { Request, Response } from 'express';",
    '',
    `import { ${PascalName}Usecase } from '../usecases/${entityName}/${entityName}.usecase.ts';`,
    '',
    `export class ${PascalName}Controller {`,
    `  constructor(private readonly ${entityName}Usecase: ${PascalName}Usecase) {}`,
    '',
    '  public async create(req: Request, res: Response): Promise<void> {',
    '    const data = req.body;',
    `    const result = await this.${entityName}Usecase.create(data);`,
    '    res.status(201).json(result);',
    '    return;',
    '  }',
    '',
    '  public async getAll(req: Request, res: Response): Promise<void> {',
    `    const result = await this.${entityName}Usecase.getAll();`,
    '    res.json(result);',
    '    return;',
    '  }',
    '',
    '  public async get(req: Request, res: Response): Promise<void> {',
    '    const { id } = req.params;',
    `    const result = await this.${entityName}Usecase.get(id);`,
    '    res.json(result);',
    '    return;',
    '  }',
    '',
    '  public async update(req: Request, res: Response): Promise<void> {',
    '    const { id } = req.params;',
    '    const data = req.body;',
    `    const result = await this.${entityName}Usecase.update(id, data);`,
    '    res.json(result);',
    '    return;',
    '  }',
    '',
    '  public async delete(req: Request, res: Response): Promise<void> {',
    '    const { id } = req.params;',
    `    await this.${entityName}Usecase.delete(id);`,
    '    res.status(204).send();',
    '    return;',
    '  }',
    '}',
    '',
  ].join('\n');
};

export { generateControllerTemplate };
