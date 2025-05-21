import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { IStudentAvatar, IStudentCourse } from '../../../interfaces/student.interface.ts';

interface IShowEntryDTO {
  id: string;
}

interface IShowReturn {
  name: string;
  id: string;
  avatar?: IStudentAvatar;
  course: IStudentCourse;
}

interface IShowUsecase {
  execute(data: IShowEntryDTO): Promise<IDefaultReturn<IShowReturn>>;
}

export type { IShowEntryDTO, IShowReturn, IShowUsecase };
