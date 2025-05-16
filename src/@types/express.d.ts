import { ISessionDTO } from '../interfaces/session.interface.ts';
import { IStudentDTO } from '../interfaces/student.interface.ts';

declare global {
  namespace Express {
    export interface Request {
      student: (Omit<IStudentDTO, 'password'> & { password: undefined }) | undefined;
      session: ISessionDTO | undefined;
      is_authenticated: boolean | undefined;
    }
  }
}
