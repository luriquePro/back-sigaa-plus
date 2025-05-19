import { FilterQuery, MongooseUpdateQueryOptions, ProjectionType, QueryOptions, SaveOptions, UpdateQuery } from 'mongoose';

import { COURSE_LEVEL, COURSE_MODALITY, COURSE_SHIFT } from './course.interface.ts';

enum STUDENT_STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  CONCLUDED = 'CONCLUDED',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

enum STUDENT_GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

interface IStudentCourse {
  id: string;
  name: string;
  code: string;
  label: string;
  modality: COURSE_MODALITY;
  shift: COURSE_SHIFT;
  level: COURSE_LEVEL;
  current_semester: number;
  duration_in_semesters: number;
  workload: number;
  completed_hours: number;
}

interface IStudentAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  zip: string;
}

interface IStudentDTO {
  id: string;
  name: string;
  login: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
  birth_date: Date;
  status: STUDENT_STATUS;
  course: IStudentCourse;
  registration_number: string;
  enrollment_date: Date;
  gender: STUDENT_GENDER;
  nationality: string;
  address: IStudentAddress;
}

interface IStudentCreateEntryDTO {}
interface IStudentCreateDTO {}
interface IStudentCreateReturn {}

interface IStudentModel extends Partial<Omit<Document, 'id'>>, IStudentDTO {}

interface IStudentRepository {
  findOneByObj(filter: FilterQuery<IStudentModel>, projection?: ProjectionType<IStudentModel>, options?: QueryOptions): Promise<IStudentDTO | null>;
  findByObj(filter: FilterQuery<IStudentModel>, projection?: ProjectionType<IStudentModel>, options?: QueryOptions): Promise<IStudentDTO[]>;
  updateOneByObj(filter: FilterQuery<IStudentModel>, data: UpdateQuery<IStudentModel>, options?: MongooseUpdateQueryOptions): Promise<void>;
  updateManyByObj(filter: FilterQuery<IStudentModel>, data: UpdateQuery<IStudentModel>, options?: MongooseUpdateQueryOptions): Promise<void>;
  deleteOneByObj(filter: FilterQuery<IStudentModel>): Promise<void>;
  deleteManyByObj(filter: FilterQuery<IStudentModel>): Promise<void>;
  upsert(filter: FilterQuery<IStudentModel>, data: UpdateQuery<IStudentModel>): Promise<IStudentModel | null>;
  create(data: IStudentCreateDTO, options?: SaveOptions): Promise<IStudentModel>;
  insertMany(data: IStudentCreateDTO[]): Promise<IStudentModel[]>;
  countDocuments(filter: FilterQuery<IStudentModel>): Promise<number>;
}

export type { IStudentCourse, IStudentCreateDTO, IStudentCreateEntryDTO, IStudentCreateReturn, IStudentDTO, IStudentModel, IStudentRepository };

export { STUDENT_GENDER, STUDENT_STATUS };
