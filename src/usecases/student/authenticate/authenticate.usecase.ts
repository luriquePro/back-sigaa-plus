import jwt from 'jsonwebtoken';

import { IDefaultReturn } from '../../../interfaces/app.interface.ts';
import { IStudentDTO, IStudentRepository } from '../../../interfaces/student.interface.ts';
import { NotFoundError } from '../../../utils/api-erros.ts';
import { ApiReturn } from '../../../utils/api-return.ts';

import { IAuthenticateEntryDTO, IAuthenticateReturn, IAuthenticateUsecase, ITokenPayload } from './authenticate.interface.ts';
import { AuthenticateValidation } from './authenticate.validation.ts';

class AuthenticateUsecase implements IAuthenticateUsecase {
  constructor(private readonly StudentRepository: IStudentRepository) {}

  public async execute(data: IAuthenticateEntryDTO): Promise<IDefaultReturn<IAuthenticateReturn>> {
    AuthenticateValidation(data);

    const { login, password } = data;

    const student = await this.StudentRepository.findOneByObj({ $or: [{ email: login.toLowerCase() }, { cpf: login }] });
    if (!student) {
      throw new NotFoundError('Aluno não encontrado. Cheque login informado.');
    }

    if (student.password !== password) {
      throw new NotFoundError('A senha informada não corresponde ao aluno informado.');
    }

    const authToken = this.getAuthToken(student);

    const result: IAuthenticateReturn = {
      id: student.id,
      name: student.name,
      email: student.email,
      cpf: student.cpf,
      token: authToken,
    };

    return ApiReturn(result);
  }

  private getAuthToken({ id, email }: IStudentDTO): string {
    const tokenPayload: ITokenPayload = { id, email };
    return jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!, { expiresIn: `${Number(process.env.EXPIRE_TOKEN_IN_DAYS ?? 1)}d` });
  }
}

export { AuthenticateUsecase };
