import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { IStudentRepository } from '../../../interfaces/student.interface.ts';
import { NotFoundError } from '../../../utils/api-erros.ts';
import { ApiReturn } from '../../../utils/api-return.ts';

import { IShowEntryDTO, IShowReturn, IShowUsecase } from './show.interface.ts';
import { ShowValidation } from './show.validation.ts';

class ShowUsecase implements IShowUsecase {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(data: IShowEntryDTO): Promise<IDefaultReturn<IShowReturn>> {
    ShowValidation(data);

    const student = await this.studentRepository.findOneByObj({ id: data.id });
    if (!student) {
      throw new NotFoundError('Não foi possivel encontrar um aluno associado ao id informado em nossos sistemas.');
    }

    const result: IShowReturn = {
      id: student.id,
      name: student.name,
      course: student.course,
      avatar: student.avatar,
    };

    return ApiReturn(result);
  }
}

export { ShowUsecase };
