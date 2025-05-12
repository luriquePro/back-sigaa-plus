import { toPascalCase } from '../../utils/toPascalCase.ts';

const generateUsecaseFunctionTemplate = (entityName: string, functionName: string): string => {
  const PascalName = toPascalCase(entityName);
  const PascalFunctionName = toPascalCase(functionName);

  return [
    `import { I${PascalName}Repository } from '../../../interfaces/${entityName}.interface.ts';`,
    '',
    `import { I${PascalFunctionName}EntryDTO, I${PascalFunctionName}Return, I${PascalFunctionName}Usecase } from './${functionName}.interface.ts';`,
    `import { ${PascalFunctionName}Validation } from './${functionName}.validation.ts';`,
    '',
    `class ${PascalFunctionName}Usecase implements I${PascalFunctionName}Usecase {`,
    `  constructor(private readonly ${PascalName}Repository: I${PascalName}Repository) {}`,
    '',
    `  public async execute(data: I${PascalFunctionName}EntryDTO): Promise<I${PascalFunctionName}Return> {`,
    `    ${PascalFunctionName}Validation(data);`,
    '',
    '    return await new Promise(resolve => resolve({}));',
    '  }',
    '}',
    '',
    `export { ${PascalFunctionName}Usecase };`,
  ].join('\n');
};

const generateUseCaseInterfaceTemplate = (functionName: string): string => {
  const PascalFunctionName = toPascalCase(functionName);

  return [
    `interface I${PascalFunctionName}EntryDTO {}`,
    `interface I${PascalFunctionName}Return {}`,
    '',
    `interface I${PascalFunctionName}Usecase {`,
    `  execute(data: I${PascalFunctionName}EntryDTO): Promise<I${PascalFunctionName}Return>;`,
    '}',
    '',
    `export type { I${PascalFunctionName}Usecase, I${PascalFunctionName}Return, I${PascalFunctionName}EntryDTO };`,
    '',
  ].join('\n');
};

const generateUseCaseValidationTemplate = (functionName: string): string => {
  const PascalFunctionName = toPascalCase(functionName);

  return [
    "import { AnyObject } from 'yup';",
    '',
    "import { YupValidate } from '../../../utils/yupValidate.util.ts';",
    '',
    `import { I${PascalFunctionName}EntryDTO } from './${functionName}.interface.ts';`,
    '',
    `const ${PascalFunctionName}Validation = (data: I${PascalFunctionName}EntryDTO): void => {`,
    '  const shape: AnyObject = {};',
    '',
    '  YupValidate(shape, data);',
    '};',
    '',
    `export { ${PascalFunctionName}Validation };`,
    '',
  ].join('\n');
};

const generateUsecaseSpecTemplate = (entityName: string, functionName: string): string => {
  const PascalName = toPascalCase(entityName);
  const PascalFunctionName = toPascalCase(functionName);

  return [
    "import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';",
    '',
    `import { I${PascalName}Repository } from '../../../interfaces/${entityName}.interface.ts';`,
    '',
    `import { I${PascalFunctionName}Usecase } from './${functionName}.interface.ts';`,
    `import { ${PascalFunctionName}Usecase } from './${functionName}.usecase.ts';`,
    '',
    `describe('${PascalFunctionName} Usecase Suite', () => {`,
    `  let usecase: I${PascalFunctionName}Usecase;`,
    '',
    '  beforeEach(() => {',
    '    const repository = jest.fn();',
    `    usecase = new ${PascalFunctionName}Usecase(repository as unknown as I${PascalName}Repository);`,
    '  });',
    '',
    '  afterEach(() => {',
    '    jest.restoreAllMocks();',
    '    jest.clearAllMocks();',
    '    jest.resetAllMocks();',
    '  });',
    '',
    "  it('should be true', () => {",
    '    expect(true).toBe(true);',
    '  });',
    '});',
    '',
  ].join('\n');
};

const generateUsecaseValidationSpecTemplate = (functionName: string): string => {
  const PascalFunctionName = toPascalCase(functionName);

  return [
    "import { afterEach, describe, expect, it, jest } from '@jest/globals';",
    '',
    `import { ${PascalFunctionName}Validation } from './${functionName}.validation.ts';`,
    '',
    `describe('${PascalFunctionName} Validation Suite', () => {`,
    '  afterEach(() => {',
    '    jest.restoreAllMocks();',
    '    jest.clearAllMocks();',
    '    jest.resetAllMocks();',
    '  });',
    '',
    "  it('', () => {",
    '    const params = {};',
    `    expect(() => ${PascalFunctionName}Validation(params)).not.toThrow();`,
    '  });',
    '});',
    '',
  ].join('\n');
};

export {
  generateUsecaseFunctionTemplate,
  generateUseCaseInterfaceTemplate,
  generateUsecaseSpecTemplate,
  generateUsecaseValidationSpecTemplate,
  generateUseCaseValidationTemplate,
};
