import { Request, Response } from 'express';
import formidable, { File } from 'formidable';

import { IAuthenticateEntryDTO, IAuthenticateUsecase } from '../usecases/student/authenticate/authenticate.interface.ts';
import { IShowEntryDTO, IShowUsecase } from '../usecases/student/show/show.interface.ts';
import { IUploadAvatarEntryDTO, IUploadAvatarUsecase } from '../usecases/student/upload-avatar/upload-avatar.interface.ts';

export class StudentController {
  constructor(
    private readonly authenticateUsecase: IAuthenticateUsecase,
    private readonly showUsecase: IShowUsecase,
    private readonly uploadAvatarUsecase: IUploadAvatarUsecase,
  ) {}

  public async authenticate(req: Request, res: Response): Promise<void> {
    const data: IAuthenticateEntryDTO = {
      login: req.body.login,
      password: req.body.password,
    };

    const result = await this.authenticateUsecase.execute(data);
    res.status(200).json(result);
    return;
  }

  public async show(req: Request, res: Response): Promise<void> {
    const data: IShowEntryDTO = { id: req.student!.id };
    const result = await this.showUsecase.execute(data);
    res.status(200).json(result);
    return;
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    return await new Promise(resolve => {
      const studentId = req.student!.id;

      const form = formidable({ multiples: false });

      form.parse(req, (error, _, files) => {
        if (error) {
          return resolve({ studentId, avatar: undefined });
        }

        if (!files || !files.image_file || !files.image_file.length) {
          return resolve({ studentId, avatar: undefined });
        }

        return resolve({ studentId, avatar: files.image_file[0] as File });
      });
    }).then(async dataUpload => {
      const result = await this.uploadAvatarUsecase.execute(dataUpload as IUploadAvatarEntryDTO);
      res.status(200).json(result);
      return;
    });
  }
}
