import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { ISessionDTO } from '../../../interfaces/session.interface.ts';
import { IStudentDTO, IStudentRepository } from '../../../interfaces/student.interface.ts';
import { ISessionService } from '../../../services/session/session.interface.ts';
import { NotFoundError } from '../../../utils/api-erros.ts';

import { IAuthenticateUsecase } from './authenticate.interface.ts';
import { AuthenticateUsecase } from './authenticate.usecase.ts';

jest.mock('../../../utils/api-return.ts', () => ({ ApiReturn: jest.fn(data => ({ success: true, data })) }));
jest.mock('./authenticate.validation.ts', () => ({ AuthenticateValidation: jest.fn().mockReturnValue(undefined) }));

describe('Authenticate Usecase Suite', () => {
  let usecase: IAuthenticateUsecase;
  const studentRepository = { findOneByObj: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;
  const sessionService = {
    getUserOpenSession: jest.fn(),
    inactivateAllUserSessions: jest.fn(),
    createUserSession: jest.fn(),
  } as unknown as jest.Mocked<ISessionService>;

  const mockStudent: Partial<IStudentDTO> = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    cpf: '12345678900',
    password: 'secret',
  };

  const mockSession: Partial<ISessionDTO> = {
    id: 'session-123',
    start_session: moment().toDate(),
    end_session: moment().add(1, 'day').toDate(),
  };

  let jwtSignSpy: jest.SpiedFunction<typeof jwt.sign>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    usecase = new AuthenticateUsecase(studentRepository, sessionService);

    process.env.JWT_SECRET_KEY = 'test-secret';
    process.env.EXPIRE_TOKEN_IN_DAYS = '2';

    sessionService.getUserOpenSession.mockResolvedValue(null);
    sessionService.createUserSession.mockResolvedValue(mockSession as ISessionDTO);

    jwtSignSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => 'fake-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should throw NotFoundError if student is not found', async () => {
    studentRepository.findOneByObj.mockResolvedValue(null);

    await expect(usecase.execute({ login: 'notfound@example.com', password: 'pass' })).rejects.toThrow(NotFoundError);

    expect(studentRepository.findOneByObj).toHaveBeenCalled();
  });

  it('should throw NotFoundError if password is incorrect', async () => {
    studentRepository.findOneByObj.mockResolvedValue({ ...(mockStudent as IStudentDTO), password: 'wrong' });

    await expect(usecase.execute({ login: mockStudent.email!, password: 'invalid' })).rejects.toThrow(
      'A senha informada não corresponde ao aluno informado.',
    );
  });

  it('should authenticate and return student data with token', async () => {
    studentRepository.findOneByObj.mockResolvedValue(mockStudent as IStudentDTO);

    const result = await usecase.execute({ login: mockStudent.email!, password: mockStudent.password! });

    expect(studentRepository.findOneByObj).toHaveBeenCalledWith({ $or: [{ email: mockStudent.email!.toLowerCase() }, { cpf: mockStudent.email }] });

    expect(sessionService.getUserOpenSession).toHaveBeenCalledWith(mockStudent.id);
    expect(sessionService.inactivateAllUserSessions).toHaveBeenCalledWith(mockStudent.id);
    expect(sessionService.createUserSession).toHaveBeenCalledWith(mockStudent.id);

    expect(jwtSignSpy).toHaveBeenCalled();

    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('id', mockStudent.id);
    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('email', mockStudent.email);
    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('sessionId', mockSession.id);
    expect(jwtSignSpy.mock.calls[0][1]).toBe('test-secret');
    expect(jwtSignSpy.mock.calls[0][2]).toEqual({ expiresIn: '2d' });

    expect(result).toHaveProperty('is_error', false);
    expect(result.response).toEqual({
      id: mockStudent.id,
      name: mockStudent.name,
      email: mockStudent.email,
      cpf: mockStudent.cpf,
      token: 'fake-token',
      start_session: mockSession.start_session,
      end_session: mockSession.end_session,
      token_expires: expect.any(Date),
    });
  });

  it('should authenticate and use existing session when open session exists', async () => {
    studentRepository.findOneByObj.mockResolvedValue(mockStudent as IStudentDTO);
    sessionService.getUserOpenSession.mockResolvedValue(mockSession as ISessionDTO);

    const result = await usecase.execute({ login: mockStudent.email!, password: mockStudent.password! });

    expect(sessionService.getUserOpenSession).toHaveBeenCalledWith(mockStudent.id);
    expect(sessionService.inactivateAllUserSessions).not.toHaveBeenCalled();
    expect(sessionService.createUserSession).not.toHaveBeenCalled();

    expect(jwtSignSpy).toHaveBeenCalled();

    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('id', mockStudent.id);
    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('email', mockStudent.email);
    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('sessionId', mockSession.id);
    expect(jwtSignSpy.mock.calls[0][1]).toBe('test-secret');
    expect(jwtSignSpy.mock.calls[0][2]).toEqual({ expiresIn: '2d' });

    expect(result).toHaveProperty('is_error', false);
    expect(result.response).toEqual({
      id: mockStudent.id,
      name: mockStudent.name,
      email: mockStudent.email,
      cpf: mockStudent.cpf,
      token: 'fake-token',
      start_session: mockSession.start_session,
      end_session: mockSession.end_session,
      token_expires: expect.any(Date),
    });
  });

  it('should authenticate and create new session if no open session exists', async () => {
    studentRepository.findOneByObj.mockResolvedValue(mockStudent as IStudentDTO);
    sessionService.getUserOpenSession.mockResolvedValue(null);
    sessionService.createUserSession.mockResolvedValue(mockSession as ISessionDTO);

    const result = await usecase.execute({ login: mockStudent.email!, password: mockStudent.password! });

    expect(sessionService.getUserOpenSession).toHaveBeenCalledWith(mockStudent.id);
    expect(sessionService.inactivateAllUserSessions).toHaveBeenCalledWith(mockStudent.id);
    expect(sessionService.createUserSession).toHaveBeenCalledWith(mockStudent.id);

    expect(jwtSignSpy).toHaveBeenCalled();

    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('id', mockStudent.id);
    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('email', mockStudent.email);
    expect(jwtSignSpy.mock.calls[0][0]).toHaveProperty('sessionId', mockSession.id);
    expect(jwtSignSpy.mock.calls[0][1]).toBe('test-secret');
    expect(jwtSignSpy.mock.calls[0][2]).toEqual({ expiresIn: '2d' });

    expect(result).toHaveProperty('is_error', false);
    expect(result.response).toEqual({
      id: mockStudent.id,
      name: mockStudent.name,
      email: mockStudent.email,
      cpf: mockStudent.cpf,
      token: 'fake-token',
      start_session: mockSession.start_session,
      end_session: mockSession.end_session,
      token_expires: expect.any(Date),
    });
  });
});
