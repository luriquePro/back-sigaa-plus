import { IDefaultReturn } from '../../../interfaces/app.interface.ts';

interface IAuthenticateEntryDTO {
  login: string;
  password: string;
}

interface IAuthenticateReturn {
  id: string;
  name: string;
  email: string;
  cpf: string;
  token: string;
  start_session: Date;
  end_session: Date;
  token_expires: Date;
}

interface IAuthenticateUsecase {
  execute(data: IAuthenticateEntryDTO): Promise<IDefaultReturn<IAuthenticateReturn>>;
}

interface ITokenPayload {
  id: string;
  email: string;
  sessionId: string;
}

export type { IAuthenticateEntryDTO, IAuthenticateReturn, IAuthenticateUsecase, ITokenPayload };
