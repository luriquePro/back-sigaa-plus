import { AnyObject, string } from 'yup';

import { YupValidate } from '../../../utils/yup_validate.ts';

import { IShowEntryDTO } from './show.interface.ts';

const ShowValidation = (data: IShowEntryDTO): void => {
  const shape: AnyObject = {
    id: string().required("O parâmetro 'id' é obrigatório").uuid("O parâmetro 'id' é inválido"),
  };

  YupValidate(shape, data);
};

export { ShowValidation };
