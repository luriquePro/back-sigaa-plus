import { IDefaultReturn } from '../interfaces/app.interface.ts';

const ApiReturn = <T>(response: T): IDefaultReturn<T> => ({
  is_error: false,
  response,
});

export { ApiReturn };
