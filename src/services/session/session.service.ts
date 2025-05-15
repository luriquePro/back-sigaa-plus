import moment from 'moment';

import { APP_CONFIG } from '../../constants/app.constant.ts';
import { ISessionCreateDTO, ISessionDTO, SESSION_STATUS } from '../../interfaces/session.interface.ts';

import { ISessionRepository, ISessionService } from './session.interface.ts';

class SessionService implements ISessionService {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  public async createUserSession(userId: string): Promise<ISessionDTO> {
    const dataSession: ISessionCreateDTO = {
      user: userId,
      start_session: moment().utc().toDate(),
      end_session: moment().utc().add(APP_CONFIG.SESSION.DURATION_TIME_IN_MINUTES, 'minutes').toDate(),
    };

    return await this.sessionRepository.create(dataSession);
  }

  public async inactivateAllUserSessions(userId: string): Promise<void> {
    return await this.sessionRepository.updateByObj({ user: userId }, { status: SESSION_STATUS.INACTIVE });
  }

  public async getUserOpenSession(userId: string): Promise<ISessionDTO | null> {
    return await this.sessionRepository.findOneByObj({
      user: userId,
      status: SESSION_STATUS.ACTIVE,
      end_session: { $gte: moment().utc().toDate() },
      start_session: { $lte: moment().utc().toDate() },
    });
  }
}

export { SessionService };
