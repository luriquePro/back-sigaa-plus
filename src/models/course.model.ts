import { model, Schema } from 'mongoose';

import { COURSE_LEVEL, COURSE_MODALITY, COURSE_SHIFT, COURSE_STATUS, ICourseModel } from '../interfaces/course.interface.ts';
import { GenerateRandomid } from '../utils/generate-random-id.ts';

const CourseSchema = new Schema<ICourseModel>(
  {
    id: { type: String, required: true, trim: true, index: true, unique: true, default: GenerateRandomid },
    name: { type: String, required: true, trim: true, index: true, unique: true },
    code: { type: String, required: true, trim: true, index: true, unique: true },
    description: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    modality: { type: String, required: true, trim: true, enum: COURSE_MODALITY, index: true },
    level: { type: String, required: true, trim: true, enum: COURSE_LEVEL, index: true },
    workload: { type: Number, required: true },
    durationInSemesters: { type: Number, required: true },
    shift: { type: String, required: true, trim: true, enum: COURSE_SHIFT, index: true },
    status: { type: String, required: true, trim: true, index: true, enum: COURSE_STATUS, default: COURSE_STATUS.ACTIVE },
  },
  { timestamps: true },
);

export const CourseModel = model<ICourseModel>('courses', CourseSchema);
