import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

import { IStudentDTO, IStudentRepository } from '../../../interfaces/student.interface.ts';
import { NotFoundError } from '../../../utils/api-erros.ts';

import { IAuthenticateUsecase } from './authenticate.interface.ts';
import { AuthenticateUsecase } from './authenticate.usecase.ts';

jest.mock('../../../utils/api-return.ts', () => ({ ApiReturn: jest.fn(data => ({ success: true, data })) }));
jest.mock('./authenticate.validation.ts', () => ({ AuthenticateValidation: jest.fn().mockReturnValue(undefined) }));

const jwtSignSpy = jest.spyOn(jwt, 'sign').mockImplementation(() => 'fake-token');

describe('Authenticate Usecase Suite', () => {
  let usecase: IAuthenticateUsecase;
  const studentRepository = { findOneByObj: jest.fn() } as unknown as jest.Mocked<IStudentRepository>;

  const mockStudent: Partial<IStudentDTO> = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    cpf: '12345678900',
    password: 'secret',
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    usecase = new AuthenticateUsecase(studentRepository);

    process.env.JWT_SECRET_KEY = 'test-secret';
    process.env.EXPIRE_TOKEN_IN_DAYS = '2';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should authenticate and return student data with token', async () => {
    studentRepository.findOneByObj.mockResolvedValue(mockStudent as IStudentDTO);
    const result = await usecase.execute({ login: mockStudent.email!, password: mockStudent.password! });

    expect(studentRepository.findOneByObj).toHaveBeenCalledWith({ $or: [{ email: mockStudent.email!.toLowerCase() }, { cpf: mockStudent.email }] });
    expect(jwtSignSpy).toHaveBeenCalledWith({ id: mockStudent.id, email: mockStudent.email }, 'test-secret', { expiresIn: '2d' });

    expect(result).toEqual({
      is_error: false,
      response: { id: mockStudent.id, name: mockStudent.name, email: mockStudent.email, cpf: mockStudent.cpf, token: 'fake-token' },
    });
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
});
