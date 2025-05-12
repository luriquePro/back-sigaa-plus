import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { IIndexDTO, IIndexModel, IIndexRepository } from '../../interfaces/index.interface.ts';

class MongoIndexRepository implements IIndexRepository {
  constructor(private readonly Model: Model<IIndexModel>) {}
  public async findOneByObj(filter: FilterQuery<IIndexModel>): Promise<IIndexDTO | null> {
    return await this.Model.findOne(filter);
  }

  public async updateOneByObj(filter: FilterQuery<IIndexModel>, data: UpdateQuery<IIndexModel>): Promise<void> {
    await this.Model.updateOne(filter, data);
  }
}

export { MongoIndexRepository };
