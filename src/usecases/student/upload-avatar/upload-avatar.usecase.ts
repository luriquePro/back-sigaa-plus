import { unlink, writeFile } from 'fs';
import path from 'path';
import { promisify } from 'util';

import imageThumbnail from 'image-thumbnail';
import moment from 'moment';

import { IUserAvatarConfigs } from '../../../constants/user.constant.ts';
import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { IStudentAvatar, IStudentDTO, IStudentRepository, StudentAvatarSize } from '../../../interfaces/student.interface.ts';
import { BadRequestError, NotFoundError } from '../../../utils/api-erros.ts';
import { ApiReturn } from '../../../utils/api-return.ts';

import { IUploadAvatarEntryDTO, IUploadAvatarReturn, IUploadAvatarUsecase } from './upload-avatar.interface.ts';
import { UploadAvatarValidation } from './upload-avatar.validation.ts';

const writeFileAsync = promisify(writeFile);
const unlinkFileAsync = promisify(unlink);

class UploadAvatarUsecase implements IUploadAvatarUsecase {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly studentAvatarConfigs: IUserAvatarConfigs,
  ) {}

  public async execute(data: IUploadAvatarEntryDTO): Promise<IDefaultReturn<IUploadAvatarReturn>> {
    UploadAvatarValidation(data);

    const student = await this.getStudentOrThrow(data.studentId);

    const baseFileName = this.generateBaseFileName(data.studentId);
    const fileExtension = this.getExtension(data.avatar.mimetype);

    const savedFileNames = await this.saveAllSizes(data.avatar.filepath, baseFileName, fileExtension);

    await this.deletePreviousAvatars(student.avatar);

    const studentAvatar: IStudentAvatar = {
      image_id_base: baseFileName,
      extension: fileExtension,
      sizes: Object.keys(savedFileNames) as StudentAvatarSize[],
    };

    await this.updateStudentAvatar(data.studentId, studentAvatar);

    return ApiReturn({
      image_id_base: studentAvatar.image_id_base,
      extension: studentAvatar.extension,
      sizes: savedFileNames,
    });
  }

  private async getStudentOrThrow(studentId: string): Promise<IStudentDTO> {
    const student = await this.studentRepository.findOneByObj({ id: studentId });
    if (!student) {
      throw new NotFoundError('O Aluno não foi encontrado em nosso sistema, por favor tente novamente.');
    }
    return student;
  }

  private generateBaseFileName(studentId: string): string {
    const timestamp = moment().format('YYYYMMDD-HHmmss');
    return `${studentId}-${timestamp}`;
  }

  private getExtension(mimetype: string | null): string {
    if (!mimetype) throw new BadRequestError('O tipo do arquivo (mimetype) não foi informado ou é inválido.');
    return mimetype.split('/')[1];
  }

  private async saveAllSizes(filepath: string, baseFileName: string, extension: string): Promise<Record<StudentAvatarSize, string>> {
    const savedFiles: Record<StudentAvatarSize, string> = {
      xs: '',
      sm: '',
      md: '',
      lg: '',
    };

    for (const [sizeKey, percentage] of Object.entries(this.studentAvatarConfigs.IMAGE_SIZES)) {
      const thumbnailBuffer = await imageThumbnail(filepath, {
        responseType: 'buffer',
        percentage,
      });

      const fileName = `${baseFileName}_${sizeKey}.${extension}`;
      const filePath = path.join(this.studentAvatarConfigs.TMP_FOLDER, fileName);

      try {
        await writeFileAsync(filePath, thumbnailBuffer);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`Falha ao gerar thumbnail para ${sizeKey}:`, err);
      }

      savedFiles[sizeKey as StudentAvatarSize] = fileName;
    }

    return savedFiles;
  }

  private async deletePreviousAvatars(avatar?: IStudentAvatar): Promise<void> {
    if (!avatar) return;

    await Promise.all(
      Object.keys(this.studentAvatarConfigs.IMAGE_SIZES).map(async sizeKey => {
        const oldFilePath = path.join(this.studentAvatarConfigs.TMP_FOLDER, `${avatar.image_id_base}_${sizeKey}.${avatar.extension}`);
        try {
          await unlinkFileAsync(oldFilePath);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`Erro ao deletar avatar antigo (${sizeKey}): ${oldFilePath}`, err);
        }
      }),
    );
  }

  private async updateStudentAvatar(studentId: string, avatar: IStudentAvatar): Promise<void> {
    await this.studentRepository.updateOneByObj({ id: studentId }, { $set: { avatar } });
  }
}

export { UploadAvatarUsecase };
