import { File } from 'formidable';

import { IDefaultReturn } from '../../../interfaces/app.interface.ts';

interface IUploadAvatarEntryDTO {
  studentId: string;
  avatar: File;
}
interface IUploadAvatarReturn {}

interface IUploadAvatarUsecase {
  execute(data: IUploadAvatarEntryDTO): Promise<IDefaultReturn<IUploadAvatarReturn>>;
}

export type { IUploadAvatarEntryDTO, IUploadAvatarReturn, IUploadAvatarUsecase };
