import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ClientSession } from 'mongoose';

import { ApiError, BadRequestError, CustomError, NotFoundError, UnauthorizedError, ValidationError } from './apiErros.util.ts';

describe('ApiError classes', () => {
  const mockSession = {
    abortTransaction: jest.fn<() => Promise<void>>().mockResolvedValue(),
    endSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an ApiError with correct properties', () => {
    const error = new ApiError('Something went wrong', 500);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(500);
    expect(error.isExpectedError).toBe(true);
  });

  it('should call abortTransaction and endSession if session is provided', async () => {
    new ApiError('With session', 400, mockSession as unknown as ClientSession);

    await Promise.resolve();

    expect(mockSession.abortTransaction).toHaveBeenCalledTimes(1);
    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
  });

  it('ValidationError should set statusCode to 422', () => {
    const error = new ValidationError('Invalid input');
    expect(error).toBeInstanceOf(ApiError);
    expect(error.statusCode).toBe(422);
  });

  it('BadRequestError should set statusCode to 400', () => {
    const error = new BadRequestError('Bad request');
    expect(error.statusCode).toBe(400);
  });

  it('UnauthorizedError should set statusCode to 401', () => {
    const error = new UnauthorizedError('Not authorized');
    expect(error.statusCode).toBe(401);
  });

  it('NotFoundError should set statusCode to 404', () => {
    const error = new NotFoundError('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('CustomError should stringify the message and set statusCode', () => {
    const messageObj = { error: 'Something custom' };
    const error = new CustomError(messageObj, 418);

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(JSON.stringify(messageObj));
    expect(error.statusCode).toBe(418);
    expect(error.isCustomError).toBe(true);
    expect(error.isExpectedError).toBe(true);
  });

  it('CustomError should handle session', async () => {
    new CustomError({ error: 'Session test' }, 400, mockSession as unknown as ClientSession);

    await Promise.resolve();

    expect(mockSession.abortTransaction).toHaveBeenCalledTimes(1);
    expect(mockSession.endSession).toHaveBeenCalledTimes(1);
  });
});
