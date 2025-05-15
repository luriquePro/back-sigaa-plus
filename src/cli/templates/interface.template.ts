import { toPascalCase } from '../../utils/to_pascal_case.ts';

const generateInterfaceTemplate = (entityName: string): string => {
  const PascalName = toPascalCase(entityName);
  const InterfacePrefix = `I${PascalName}`;

  return [
    'import { FilterQuery, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, SaveOptions, UpdateQuery } from "mongoose";',
    '',
    `interface ${InterfacePrefix}DTO {`,
    '  id: string;',
    '  // Add your entity fields here',
    '}',
    '',
    `interface ${InterfacePrefix}CreateEntryDTO {}`,
    `interface ${InterfacePrefix}CreateDTO {}`,
    `interface ${InterfacePrefix}CreateReturn {}`,
    '',
    `interface ${InterfacePrefix}Model extends Partial<Omit<Document, 'id'>>, ${InterfacePrefix}DTO {}`,
    '',
    `interface ${InterfacePrefix}Repository {`,
    `  findOneByObj(filter: FilterQuery<${InterfacePrefix}Model>, projection?: ProjectionType<${InterfacePrefix}Model>, options?: QueryOptions): Promise<${InterfacePrefix}DTO | null>;`,
    `  findByObj(filter: FilterQuery<${InterfacePrefix}Model>, projection?: ProjectionType<${InterfacePrefix}Model>, options?: QueryOptions): Promise<${InterfacePrefix}DTO[]>;`,
    `  updateOneByObj(filter: FilterQuery<${InterfacePrefix}Model>, data: UpdateQuery<${InterfacePrefix}Model>, options?: MongooseUpdateQueryOptions): Promise<void>;`,
    `  updateManyByObj(filter: FilterQuery<${InterfacePrefix}Model>, data: UpdateQuery<${InterfacePrefix}Model>, options?: MongooseUpdateQueryOptions): Promise<void>;`,
    `  deleteOneByObj(filter: FilterQuery<${InterfacePrefix}Model>): Promise<void>;`,
    `  deleteManyByObj(filter: FilterQuery<${InterfacePrefix}Model>): Promise<void>;`,
    `  upsert(filter: FilterQuery<${InterfacePrefix}Model>, data: UpdateQuery<${InterfacePrefix}Model>): Promise<${InterfacePrefix}Model | null>;`,
    `  create(data: ${InterfacePrefix}CreateDTO, options?: SaveOptions): Promise<${InterfacePrefix}Model>;`,
    `  insertMany(data: ${InterfacePrefix}CreateDTO[]): Promise<${InterfacePrefix}Model[]>;`,
    `  countDocuments(filter: FilterQuery<${InterfacePrefix}Model>): Promise<number>;`,
    '}',
    '',
    `export type { ${InterfacePrefix}DTO, ${InterfacePrefix}CreateEntryDTO, ${InterfacePrefix}CreateDTO, ${InterfacePrefix}CreateReturn, ${InterfacePrefix}Model, ${InterfacePrefix}Repository }`,
    '',
  ].join('\n');
};

export { generateInterfaceTemplate };
