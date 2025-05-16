import { FilterQuery, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';

enum COURSE_MODALITY {
  PRESENTIAL = 'Presencial',
  EAD = 'EAD',
  HYBRID = 'Híbrido',
}

enum COURSE_LEVEL {
  TECHNOLOGIST = 'Tecnólogo',
  BACHELOR = 'Bacharelado',
  LICENTIATE = 'Licenciatura',
  POSTGRADUATE = 'Pós-graduação',
}

enum COURSE_SHIFT {
  MORNING = 'Matutino',
  AFTERNOON = 'Vespertino',
  EVENING = 'Noturno',
  FULL_DAY = 'Integral',
}

enum COURSE_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

interface ICourseDTO {
  id: string;
  name: string;
  code: string;
  description: string;
  label: string;
  modality: COURSE_MODALITY;
  level: COURSE_LEVEL;
  workload: number;
  duration_in_semesters: number;
  shift: COURSE_SHIFT;
  status: COURSE_STATUS;
}

interface ICourseModel extends Partial<Omit<Document, 'id'>>, ICourseDTO {}

interface ICourseCreateDTO {}

interface ICourseRepository {
  create(data: ICourseCreateDTO, options?: SaveOptions): Promise<ICourseModel>;
  findByObj(filter: FilterQuery<ICourseModel>, projection?: ProjectionType<ICourseModel>, options?: QueryOptions): Promise<ICourseDTO[]>;
  updateOneByObj(filter: FilterQuery<ICourseModel>, data: UpdateQuery<ICourseModel>, options?: MongooseUpdateQueryOptions): Promise<void>;
  updateManyByObj(filter: FilterQuery<ICourseModel>, data: UpdateQuery<ICourseModel>, options?: MongooseUpdateQueryOptions): Promise<void>;
  deleteOneByObj(filter: FilterQuery<ICourseModel>): Promise<void>;
  deleteManyByObj(filter: FilterQuery<ICourseModel>): Promise<void>;
  upsert(filter: FilterQuery<ICourseModel>, data: UpdateQuery<ICourseModel>): Promise<ICourseModel | null>;
  insertMany(data: ICourseCreateDTO[]): Promise<ICourseModel[]>;
  countDocuments(filter: FilterQuery<ICourseModel>): Promise<number>;
}

export { COURSE_LEVEL, COURSE_MODALITY, COURSE_SHIFT, COURSE_STATUS };
export type { ICourseCreateDTO, ICourseDTO, ICourseModel, ICourseRepository };
