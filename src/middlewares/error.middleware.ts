import { NextFunction, Request, Response } from 'express';

import { ApiError, CustomError } from '../utils/api-erros.ts';

export const errorMiddleware = (error: Error & Partial<ApiError> & Partial<CustomError>, req: Request, res: Response, _: NextFunction): void => {
  const statusCode = error.statusCode ?? 500;
  const message = error.isExpectedError ? error.message : 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

  if (error.isCustomError) {
    res.status(statusCode).json({ ...JSON.parse(message), is_error: true });
    return;
  } else {
    res.status(statusCode).json({ message, is_error: true });
    return;
  }
};
