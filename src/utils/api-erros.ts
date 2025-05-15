import { ClientSession } from 'mongoose';

export class ApiError extends Error {
  public readonly statusCode: number;
  readonly isExpectedError: boolean = true;

  constructor(message: string, statusCode: number, session?: ClientSession) {
    if (session) {
      session.abortTransaction().then(() => {
        session.endSession();
      });
    }
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 422);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, session?: ClientSession) {
    super(message, 400, session);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string, session?: ClientSession) {
    super(message, 401, session);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string, session?: ClientSession) {
    super(message, 403, session);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string, session?: ClientSession) {
    super(message, 404, session);
  }
}

export class CustomError extends Error {
  public readonly statusCode: number;
  readonly isCustomError: boolean = true;
  readonly isExpectedError: boolean = true;

  constructor(message: object, statusCode: number, session?: ClientSession) {
    if (session) {
      session.abortTransaction().then(() => {
        session.endSession();
      });
    }

    super(JSON.stringify(message));
    this.statusCode = statusCode;
  }
}
