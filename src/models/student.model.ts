import { model, Schema } from 'mongoose';

import { IStudentModel, STUDENT_GENDER, STUDENT_STATUS } from '../interfaces/student.interface.ts';
import { GenerateRandomid } from '../utils/generateRandomId.util.ts';

const StudentSchema = new Schema<IStudentModel>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
      default: GenerateRandomid,
    },
    name: { type: String, required: true, trim: true },
    login: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    birth_date: { type: Date, required: true },
    status: {
      type: String,
      enum: STUDENT_STATUS,
      required: true,
      default: STUDENT_STATUS.PENDING,
    },
    course: { id: { type: String, required: true }, name: { type: String, required: true } },
    registration_number: { type: String, required: true, unique: true },
    enrollment_date: { type: Date, required: true },
    gender: { type: String, enum: STUDENT_GENDER, required: true },
    nationality: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      number: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
  },
  { timestamps: true },
);

export const StudentModel = model<IStudentModel>('student', StudentSchema);
