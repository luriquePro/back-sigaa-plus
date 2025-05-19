import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { IStudentCourse } from '../../../interfaces/student.interface.ts';

interface IShowEntryDTO {
  id: string;
}

interface IShowReturn {
  name: string;
  id: string;
  course: IStudentCourse;
}

interface IShowUsecase {
  execute(data: IShowEntryDTO): Promise<IDefaultReturn<IShowReturn>>;
}

export type { IShowEntryDTO, IShowReturn, IShowUsecase };
