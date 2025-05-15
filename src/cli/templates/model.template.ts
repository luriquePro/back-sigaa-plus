import { toPascalCase } from '../../utils/to_pascal_case.ts';

const generateModelTemplate = (entityName: string): string => {
  const PascalName = toPascalCase(entityName);

  return [
    "import { model, Schema } from 'mongoose';",
    '',
    `import { I${PascalName}Model } from '../interfaces/${entityName}.interface.ts';`,
    "import { GenerateRandomid } from '../utils/generateRandomId.util.ts';",
    '',
    `const ${PascalName}Schema = new Schema<I${PascalName}Model>(`,
    '  {',
    '    id: {',
    '      type: String,',
    '      required: true,',
    '      trim: true,',
    '      index: true,',
    '      unique: true,',
    '      default: GenerateRandomid,',
    '    },',
    '  },',
    '  { timestamps: true },',
    ');',
    '',
    `export const ${PascalName}Model = model<I${PascalName}Model>('${entityName}', ${PascalName}Schema);`,
    ' ',
  ].join('\n');
};

export { generateModelTemplate };
