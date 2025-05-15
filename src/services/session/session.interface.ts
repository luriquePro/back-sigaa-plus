import { FilterQuery, UpdateQuery } from 'mongoose';

import { ISessionCreateDTO, ISessionDTO } from '../../interfaces/session.interface.ts';

interface ISessionService {
  createUserSession(userId: string): Promise<ISessionDTO>;
  inactivateAllUserSessions(userId: string): Promise<void>;
  getUserOpenSession(userId: string): Promise<ISessionDTO | null>;
}

interface ISessionRepository {
  create(dataSession: ISessionCreateDTO): Promise<ISessionDTO>;
  updateByObj(dataFilter: FilterQuery<ISessionDTO>, dataUpdate: UpdateQuery<ISessionDTO>): Promise<void>;
  findOneByObj(dataFilter: FilterQuery<ISessionDTO>): Promise<ISessionDTO | null>;
}

export type { ISessionRepository, ISessionService };
