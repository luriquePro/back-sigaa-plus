import { model, Schema } from 'mongoose';

import { USER_AVATAR_CONFIGS } from '../constants/user.constant.ts';
import { COURSE_LEVEL, COURSE_MODALITY, COURSE_SHIFT } from '../interfaces/course.interface.ts';
import { IStudentModel, STUDENT_GENDER, STUDENT_STATUS, StudentAvatarSize } from '../interfaces/student.interface.ts';
import { GenerateRandomid } from '../utils/generate-random-id.ts';

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
    course: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true },
      label: { type: String, required: true },
      modality: { type: String, required: true, enum: COURSE_MODALITY },
      shift: { type: String, required: true, enum: COURSE_SHIFT },
      level: { type: String, required: true, enum: COURSE_LEVEL },
      current_semester: { type: Number, required: true },
      duration_in_semesters: { type: Number, required: true },
      workload: { type: Number, required: true },
      completed_hours: { type: Number, required: true },
    },
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
    avatar: {
      image_id_base: { type: String },
      extension: { type: String, enum: USER_AVATAR_CONFIGS.FILE_EXTENSIONS },
      sizes: { type: [String] },
    },
  },
  { timestamps: true },
);

StudentSchema.post(['find', 'findOne'], document => {
  if (document && document.avatar) {
    const avatarSizes = document.avatar.sizes as StudentAvatarSize[];

    const imageSizesWithPath: Partial<Record<StudentAvatarSize, string>> = {};

    for (const size of avatarSizes) {
      imageSizesWithPath[size] = `${process.env.API_IMAGE_URL}/${document.avatar.image_id_base}_${size}.${document.avatar.extension}`;
    }

    document.avatar.sizes = imageSizesWithPath;
  }
});

export const StudentModel = model<IStudentModel>('student', StudentSchema);
