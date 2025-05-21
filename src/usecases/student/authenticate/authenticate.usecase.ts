import jwt from 'jsonwebtoken';
import moment from 'moment';

import { APP_CONFIG } from '../../../constants/app.constant.ts';
import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { ISessionDTO } from '../../../interfaces/session.interface.ts';
import { IStudentDTO, IStudentRepository } from '../../../interfaces/student.interface.ts';
import { ISessionService } from '../../../services/session/session.interface.ts';
import { NotFoundError } from '../../../utils/api-erros.ts';
import { ApiReturn } from '../../../utils/api-return.ts';

import { IAuthenticateEntryDTO, IAuthenticateReturn, IAuthenticateUsecase, ITokenPayload } from './authenticate.interface.ts';
import { AuthenticateValidation } from './authenticate.validation.ts';

class AuthenticateUsecase implements IAuthenticateUsecase {
  private readonly JWT_EXPIRATION_DAYS: number;

  constructor(
    private readonly studentRepository: IStudentRepository,
    private readonly sessionService: ISessionService,
  ) {
    this.JWT_EXPIRATION_DAYS = Number(process.env.EXPIRE_TOKEN_IN_DAYS ?? 1);
  }

  public async execute(data: IAuthenticateEntryDTO): Promise<IDefaultReturn<IAuthenticateReturn>> {
    AuthenticateValidation(data);

    const student = await this.findAndValidateStudent(data);
    const session = await this.getOrCreateSession(student.id);
    const authToken = this.generateAuthToken(student, session);

    return ApiReturn(this.buildAuthenticationResponse(student, session, authToken));
  }

  private async findAndValidateStudent({ login, password }: IAuthenticateEntryDTO): Promise<IStudentDTO> {
    const student = await this.studentRepository.findOneByObj({ $or: [{ email: login.toLowerCase() }, { cpf: login }] });

    if (!student) {
      throw new NotFoundError('Aluno não encontrado. Cheque login informado.');
    }

    if (student.password !== password) {
      throw new NotFoundError('A senha informada não corresponde ao aluno informado.');
    }

    return student;
  }

  private async getOrCreateSession(studentId: string): Promise<ISessionDTO> {
    if (!APP_CONFIG.AUTH.ALLOW_MULTIPLE_DEVICES) {
      await this.sessionService.inactivateAllUserSessions(studentId);
      return this.sessionService.createUserSession(studentId);
    }

    const existingSession = await this.sessionService.getUserOpenSession(studentId);
    if (existingSession) {
      return existingSession;
    }

    await this.sessionService.inactivateAllUserSessions(studentId);
    return this.sessionService.createUserSession(studentId);
  }

  private generateAuthToken(student: IStudentDTO, session: ISessionDTO): string {
    const tokenPayload: ITokenPayload = {
      id: student.id,
      email: student.email,
      sessionId: session.id,
    };

    return jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!, { expiresIn: `${this.JWT_EXPIRATION_DAYS}d` });
  }

  private buildAuthenticationResponse(student: IStudentDTO, session: ISessionDTO, token: string): IAuthenticateReturn {
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      cpf: student.cpf,
      token,
      start_session: session.start_session,
      end_session: session.end_session,
      token_expires: moment().add(this.JWT_EXPIRATION_DAYS, 'days').toDate(),
    };
  }
}

export { AuthenticateUsecase };
