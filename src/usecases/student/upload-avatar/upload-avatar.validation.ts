import { File } from 'formidable';
import { AnyObject, mixed, string } from 'yup';

import { USER_AVATAR_CONFIGS } from '../../../constants/user.constant.ts';
import { YupValidate } from '../../../utils/yup_validate.ts';

import { IUploadAvatarEntryDTO } from './upload-avatar.interface.ts';

const UploadAvatarValidation = (data: IUploadAvatarEntryDTO): void => {
  const shape: AnyObject = {
    studentId: string().required("O parâmetro 'studentId' é obrigatório").uuid("O parâmetro 'studentId' é inválido"),
    avatar: mixed<File>()
      .required("O parâmetro 'avatar' é obrigatório")
      .test('file-is-required', "O parâmetro 'avatar' é obrigatório", value => !!value)
      .test(
        'is-file',
        'O parâmetro avatar precisa ser um arquivo',
        (value: File) => value && typeof value.filepath === 'string' && typeof value.originalFilename === 'string',
      )
      .test('extension-is-valid', 'A extensão do arquivo precisa ser png, jpg, jpeg ou gif', (value: File) => {
        const extension = String(value.mimetype?.split('/')[1]! || value.filepath.split('.').pop()?.toLocaleLowerCase());
        return USER_AVATAR_CONFIGS.FILE_EXTENSIONS.includes(extension);
      })
      .test(
        'size-is-valid',
        `O tamanho do arquivo precisa ser menor que ${USER_AVATAR_CONFIGS.MAX_SIZE / 1024 / 1024}MB`,
        (value: File) => value.size <= USER_AVATAR_CONFIGS.MAX_SIZE,
      ),
  };

  YupValidate(shape, data);
};

export { UploadAvatarValidation };
