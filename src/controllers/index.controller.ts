import { Request, Response } from 'express';

import { IIndexHelloWorldEntryDTO, IIndexHelloWorldUsecase } from '../usecases/index/hello-world/hello-world.interface.ts';

class IndexController {
  constructor(private readonly IndexHelloWorldUsecase: IIndexHelloWorldUsecase) {}

  public async helloWorld(req: Request, res: Response): Promise<void> {
    const params: IIndexHelloWorldEntryDTO = {
      message: req.query.message as string,
    };

    const result = await this.IndexHelloWorldUsecase.execute(params);
    res.json(result);
    return;
  }
}

export { IndexController };
