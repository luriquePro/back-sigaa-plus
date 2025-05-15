import { model, Schema } from 'mongoose';

import { ISessionModel, SESSION_STATUS } from '../interfaces/session.interface.ts';
import { GenerateRandomid } from '../utils/generate-random-id.ts';

const SessionSchema = new Schema<ISessionModel>(
  {
    id: { type: String, required: true, trim: true, index: true, unique: true, default: GenerateRandomid },
    status: { type: String, required: true, trim: true, index: true, enum: SESSION_STATUS, default: SESSION_STATUS.ACTIVE },
    user: { type: String, required: true, trim: true, index: true },
    start_session: { type: Date, required: true, index: true },
    end_session: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

export const SessionModel = model<ISessionModel>('sessions', SessionSchema);
