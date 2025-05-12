import { AnyObject, string } from 'yup';

import { YupValidate } from '../../../utils/yupValidate.util.ts';

import { IIndexHelloWorldEntryDTO } from './hello-world.interface.ts';

const validateIndexHelloWorld = (data: IIndexHelloWorldEntryDTO): void => {
  const shape: AnyObject = {
    message: string().strict(),
  };

  YupValidate(shape, data);
};

export { validateIndexHelloWorld };
