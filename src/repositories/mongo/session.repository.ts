import { FilterQuery, Model, UpdateQuery } from 'mongoose';

import { ISessionCreateDTO, ISessionDTO, ISessionModel } from '../../interfaces/session.interface.ts';
import { ISessionRepository } from '../../services/session/session.interface.ts';

class SessionRepository implements ISessionRepository {
  constructor(private readonly sessionModel: Model<ISessionModel>) {}

  public async create(dataSession: ISessionCreateDTO): Promise<ISessionDTO> {
    return this.sessionModel.create(dataSession);
  }

  public async findOneByObj(dataFilter: FilterQuery<ISessionDTO>): Promise<ISessionDTO | null> {
    return this.sessionModel.findOne(dataFilter);
  }

  public async updateByObj(dataFilter: FilterQuery<ISessionDTO>, dataUpdate: UpdateQuery<ISessionDTO>): Promise<void> {
    await this.sessionModel.updateMany(dataFilter, dataUpdate);
  }
}

export { SessionRepository };
