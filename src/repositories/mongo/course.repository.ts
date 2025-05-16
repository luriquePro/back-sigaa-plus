import { FilterQuery, Model, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';

import { ICourseCreateDTO, ICourseDTO, ICourseModel, ICourseRepository } from '../../interfaces/course.interface.ts';

class MongoCourseRepository implements ICourseRepository {
  constructor(private readonly Model: Model<ICourseModel>) {}

  public async create(data: ICourseCreateDTO, options?: SaveOptions): Promise<ICourseModel> {
    return await new this.Model(data).save(options);
  }

  public async findByObj(
    filter: FilterQuery<ICourseModel>,
    projection?: ProjectionType<ICourseModel>,
    options?: QueryOptions,
  ): Promise<ICourseDTO[]> {
    return await this.Model.find(filter, projection, options).lean();
  }

  public async findOneByObj(
    filter: FilterQuery<ICourseModel>,
    projection?: ProjectionType<ICourseModel>,
    options?: QueryOptions,
  ): Promise<ICourseDTO | null> {
    return await this.Model.findOne(filter, projection, options).lean();
  }

  public async updateOneByObj(
    filter: FilterQuery<ICourseModel>,
    data: UpdateQuery<ICourseModel>,
    options?: MongooseUpdateQueryOptions,
  ): Promise<void> {
    await this.Model.updateOne(filter, data, options);
  }

  public async updateManyByObj(
    filter: FilterQuery<ICourseModel>,
    data: UpdateQuery<ICourseModel>,
    options?: MongooseUpdateQueryOptions,
  ): Promise<void> {
    await this.Model.updateMany(filter, data, options);
  }

  public async deleteOneByObj(filter: FilterQuery<ICourseModel>): Promise<void> {
    await this.Model.deleteOne(filter);
  }

  public async deleteManyByObj(filter: FilterQuery<ICourseModel>): Promise<void> {
    await this.Model.deleteMany(filter);
  }

  public async upsert(filter: FilterQuery<ICourseModel>, data: UpdateQuery<ICourseModel>): Promise<ICourseModel | null> {
    return await this.Model.findOneAndUpdate(filter, data, { upsert: true });
  }

  public async insertMany(data: ICourseCreateDTO[]): Promise<ICourseModel[]> {
    return await this.Model.insertMany(data);
  }

  public async countDocuments(filter: FilterQuery<ICourseModel>): Promise<number> {
    return await this.Model.countDocuments(filter);
  }
}

export { MongoCourseRepository };
