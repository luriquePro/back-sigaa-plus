import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { COURSE_STATUS } from '../../../interfaces/course.interface.ts';
import { IStudentAvatar, IStudentCourse } from '../../../interfaces/student.interface.ts';

interface IShowEntryDTO {
  id: string;
}

interface IShowReturn {
  name: string;
  id: string;
  registration_number: string;
  avatar?: IStudentAvatar;
  course: IStudentCourse & { status: COURSE_STATUS };
}

interface IShowUsecase {
  execute(data: IShowEntryDTO): Promise<IDefaultReturn<IShowReturn>>;
}

export type { IShowEntryDTO, IShowReturn, IShowUsecase };
