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
}

interface IAuthenticateUsecase {
  execute(data: IAuthenticateEntryDTO): Promise<IDefaultReturn<IAuthenticateReturn>>;
}

interface ITokenPayload {
  id: string;
  email: string;
}

export type { IAuthenticateEntryDTO, IAuthenticateReturn, IAuthenticateUsecase, ITokenPayload };
