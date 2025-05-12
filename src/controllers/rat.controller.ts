import { Request, Response } from 'express';

import { RatUsecase } from '../usecases/rat/rat.usecase.ts';

export class RatController {
  constructor(private readonly ratUsecase: RatUsecase) {}

  public async create(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const result = await this.ratUsecase.create(data);
    res.status(201).json(result);
    return;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    const result = await this.ratUsecase.getAll();
    res.json(result);
    return;
  }

  public async get(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.ratUsecase.get(id);
    res.json(result);
    return;
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = req.body;
    const result = await this.ratUsecase.update(id, data);
    res.json(result);
    return;
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.ratUsecase.delete(id);
    res.status(204).send();
    return;
  }
}