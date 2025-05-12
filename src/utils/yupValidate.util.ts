import { AnyObject, object } from 'yup';

import { ValidationError } from './apiErros.util.ts';

const YupValidate = (shape: AnyObject, data: object): void => {
  try {
    object().shape(shape).validateSync(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new ValidationError(error.errors);
  }
};

export { YupValidate };
