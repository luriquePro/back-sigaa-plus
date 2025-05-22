import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { ICourseRepository } from '../../../interfaces/course.interface.ts';
import { IStudentRepository } from '../../../interfaces/student.interface.ts';
import { NotFoundError } from '../../../utils/api-erros.ts';
import { ApiReturn } from '../../../utils/api-return.ts';

import { IShowEntryDTO, IShowReturn, IShowUsecase } from './show.interface.ts';
import { ShowValidation } from './show.validation.ts';

class ShowUsecase implements IShowUsecase {
  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  public async execute(data: IShowEntryDTO): Promise<IDefaultReturn<IShowReturn>> {
    ShowValidation(data);

    const student = await this.studentRepository.findOneByObj({ id: data.id });
    if (!student) {
      throw new NotFoundError('Não foi possivel encontrar um aluno associado ao id informado em nossos sistemas.');
    }

    const studentCourse = await this.courseRepository.findOneByObj({ id: student.course.id });
    if (!studentCourse) {
      throw new NotFoundError('Não foi possivel encontrar um curso associado ao aluno informado em nossos sistemas.');
    }

    const result: IShowReturn = {
      id: student.id,
      name: student.name,
      course: { ...student.course, status: studentCourse.status },
      avatar: student.avatar,
      registration_number: student.registration_number,
      cpf: student.cpf,
      email: student.email,
      rg: student.rg,
      phone: student.phone,
      birth_date: student.birth_date,
    };

    return ApiReturn(result);
  }
}

export { ShowUsecase };
