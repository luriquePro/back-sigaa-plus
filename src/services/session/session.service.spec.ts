import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import moment from 'moment';

import { APP_CONFIG } from '../../constants/app.constant.ts';
import { SESSION_STATUS } from '../../interfaces/session.interface.ts';

import { ISessionRepository } from './session.interface.ts';
import { SessionService } from './session.service.ts';

describe('SessionService', () => {
  const mockSessionRepository = {
    create: jest.fn(),
    findOneByObj: jest.fn(),
    updateByObj: jest.fn(),
  };

  const userId = '123456789';

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-15T13:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should create a new user session', async () => {
    const expectedStart = new Date('2025-05-15T13:00:00.000Z');
    const expectedEnd = new Date('2025-05-15T13:00:00.000Z');
    expectedEnd.setMinutes(expectedEnd.getMinutes() + APP_CONFIG.SESSION.DURATION_TIME_IN_MINUTES);

    const sessionService = new SessionService(mockSessionRepository as unknown as ISessionRepository);

    await sessionService.createUserSession(userId);

    expect(mockSessionRepository.create).toBeCalledWith({
      user: userId,
      start_session: expectedStart,
      end_session: expectedEnd,
    });
  });

  it('should inactivate all user sessions', async () => {
    const sessionService = new SessionService(mockSessionRepository as unknown as ISessionRepository);

    await sessionService.inactivateAllUserSessions(userId);

    expect(mockSessionRepository.updateByObj).toBeCalledWith({ user: userId }, { status: SESSION_STATUS.INACTIVE });
  });

  it('should get an open user session', async () => {
    jest.spyOn(mockSessionRepository, 'findOneByObj').mockResolvedValue(null as never);

    const sessionService = new SessionService(mockSessionRepository as unknown as ISessionRepository);

    const session = await sessionService.getUserOpenSession(userId);

    expect(mockSessionRepository.findOneByObj).toBeCalledWith({
      user: userId,
      status: SESSION_STATUS.ACTIVE,
      end_session: { $gte: moment().utc().toDate() },
      start_session: { $lte: moment().utc().toDate() },
    });

    expect(session).toBeNull();
  });
});
