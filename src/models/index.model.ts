import { model, Schema } from 'mongoose';

import { IIndexModel, INDEX_STATUS } from '../interfaces/index.interface.ts';
import { GenerateRandomid } from '../utils/generateRandomId.util.ts';

const UserSchema = new Schema<IIndexModel>(
  {
    id: { type: String, required: true, trim: true, index: true, unique: true, default: GenerateRandomid },
    status: { type: String, required: true, trim: true, index: true, enum: INDEX_STATUS },
    roles: { type: [String], default: ['common'] },
  },
  { timestamps: true },
);

export const UserModel = model<IIndexModel>('index', UserSchema);
