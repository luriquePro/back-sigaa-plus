import { AnyObject, object } from 'yup';

import { CustomError } from './api-erros.ts';

const YupValidate = (shape: AnyObject, data: object): void => {
  try {
    object().shape(shape).validateSync(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new CustomError({ message: error.message, path: error.path }, 422);
  }
};

export { YupValidate };
