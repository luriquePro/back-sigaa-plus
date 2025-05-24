import { File } from 'formidable';

import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { StudentAvatarSize } from '../../../interfaces/student.interface.ts';

interface IUploadAvatarEntryDTO {
  studentId: string;
  avatar: File;
}
interface IUploadAvatarReturn {
  image_id_base: string;
  extension: string;
  sizes: Record<StudentAvatarSize, string>;
}

interface IUploadAvatarUsecase {
  execute(data: IUploadAvatarEntryDTO): Promise<IDefaultReturn<IUploadAvatarReturn>>;
}

export type { IUploadAvatarEntryDTO, IUploadAvatarReturn, IUploadAvatarUsecase };
