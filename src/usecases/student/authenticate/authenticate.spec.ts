import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { IStudentRepository } from '../../../interfaces/student.interface.ts';

import { IAuthenticateUsecase } from './authenticate.interface.ts';
import { AuthenticateUsecase } from './authenticate.usecase.ts';

describe('Authenticate Usecase Suite', () => {
  let usecase: IAuthenticateUsecase;

  beforeEach(() => {
    const repository = jest.fn();
    usecase = new AuthenticateUsecase(repository as unknown as IStudentRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should be true', () => {
    expect(true).toBe(true);
  });
});
