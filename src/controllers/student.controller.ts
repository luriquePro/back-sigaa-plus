import { Request, Response } from 'express';

import { IAuthenticateEntryDTO, IAuthenticateUsecase } from '../usecases/student/authenticate/authenticate.interface.ts';
import { IShowEntryDTO, IShowUsecase } from '../usecases/student/show/show.interface.ts';

export class StudentController {
  constructor(
    private readonly authenticateUsecase: IAuthenticateUsecase,
    private readonly showUsecase: IShowUsecase,
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
}
