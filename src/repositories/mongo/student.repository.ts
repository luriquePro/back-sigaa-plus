import { FilterQuery, Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';

import { IStudentCreateDTO, IStudentDTO, IStudentModel, IStudentRepository } from '../../interfaces/student.interface.ts';

class MongoStudentRepository implements IStudentRepository {
  constructor(private readonly Model: Model<IStudentModel>) {}

  public async create(data: IStudentCreateDTO, options?: SaveOptions): Promise<IStudentModel> {
    return await new this.Model(data).save(options);
  }

  public async findByObj(
    filter: FilterQuery<IStudentModel>,
    projection?: ProjectionType<IStudentModel>,
    options?: QueryOptions,
  ): Promise<IStudentDTO[]> {
    return await this.Model.find(filter, projection, options).lean();
  }

  public async findOneByObj(
    filter: FilterQuery<IStudentModel>,
    projection?: ProjectionType<IStudentModel>,
    options?: QueryOptions,
  ): Promise<IStudentDTO | null> {
    return await this.Model.findOne(filter, projection, options).lean();
  }

  public async updateOneByObj(
    filter: FilterQuery<IStudentModel>,
    data: UpdateQuery<IStudentModel>,
    options?: MongooseUpdateQueryOptions,
  ): Promise<void> {
    await this.Model.updateOne(filter, data, options);
  }

  public async updateManyByObj(
    filter: FilterQuery<IStudentModel>,
    data: UpdateQuery<IStudentModel>,
    options?: MongooseUpdateQueryOptions,
  ): Promise<void> {
    await this.Model.updateMany(filter, data, options);
  }

  public async deleteOneByObj(filter: FilterQuery<IStudentModel>): Promise<void> {
    await this.Model.deleteOne(filter);
  }

  public async deleteManyByObj(filter: FilterQuery<IStudentModel>): Promise<void> {
    await this.Model.deleteMany(filter);
  }

  public async upsert(filter: FilterQuery<IStudentModel>, data: UpdateQuery<IStudentModel>): Promise<IStudentModel | null> {
    return await this.Model.findOneAndUpdate(filter, data, { upsert: true });
  }

  public async insertMany(data: IStudentCreateDTO[]): Promise<IStudentModel[]> {
    return await this.Model.insertMany(data);
  }

  public async countDocuments(filter: FilterQuery<IStudentModel>): Promise<number> {
    return await this.Model.countDocuments(filter);
  }
}

export { MongoStudentRepository };
