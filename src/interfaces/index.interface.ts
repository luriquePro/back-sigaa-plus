import { FilterQuery, UpdateQuery } from 'mongoose';

enum INDEX_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

type INDEX_ROLE = 'adm' | 'common';

interface IIndexDTO {
  id: string;
  status: INDEX_STATUS;
  roles: INDEX_ROLE[];
}

interface IIndexModel extends Partial<Omit<Document, 'id'>>, IIndexDTO {}

interface IIndexRepository {
  findOneByObj(filter: FilterQuery<IIndexModel>): Promise<IIndexDTO | null>;
  updateOneByObj(filter: FilterQuery<IIndexModel>, data: UpdateQuery<IIndexModel>): Promise<void>;
}

interface IIndexUsecase {}

export { INDEX_STATUS };
export type { IIndexDTO, IIndexModel, IIndexRepository, IIndexUsecase, INDEX_ROLE };
