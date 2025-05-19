import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { SESSION_STATUS } from '../interfaces/session.interface.ts';
import { STUDENT_STATUS } from '../interfaces/student.interface.ts';
import { SessionModel } from '../models/session.model.ts';
import { StudentModel } from '../models/student.model.ts';
import { MongoSessionRepository } from '../repositories/mongo/session.repository.ts';
import { MongoStudentRepository } from '../repositories/mongo/student.repository.ts';
import { ITokenPayload } from '../usecases/student/authenticate/authenticate.interface.ts';
import { CustomError } from '../utils/api-erros.ts';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const StudentRepository = new MongoStudentRepository(StudentModel);
  const SessionRepository = new MongoSessionRepository(SessionModel);

  const token = req.headers['x-access-token'] as string;

  // Se o token não for fornecido, exigir que refaça o login
  if (!token) {
    resetRequest(req);
    throw new CustomError({ message: 'Sessão expirada. Faça login novamente', requires_login: true }, 401);
  }

  // Valida e decodifica o token
  const { userId, sessionId } = decodeToken(token);

  // Buscar o usuário no banco de dados
  const student = await StudentRepository.findOneByObj({ id: userId });
  if (!student) {
    resetRequest(req);
    throw new CustomError({ message: 'Sessão expirada. Faça login novamente', requires_login: true }, 401);
  }

  // Busca a sessão no banco de dados
  const session = await SessionRepository.findOneByObj({ id: sessionId, status: SESSION_STATUS.ACTIVE });
  if (!session) {
    resetRequest(req);
    throw new CustomError({ message: 'Sessão expirada. Faça login novamente', requires_login: true }, 401);
  }

  // Garante que o usuário está ativo
  validateUserStatus(student.status);

  // Armazenar o usuário na requisição, sem a senha
  req.student = { ...student, password: undefined };
  req.is_authenticated = true;
  req.session = session;

  next();
};

const decodeToken = (token: string): { userId: string; sessionId: string } => {
  try {
    // Verificar e decodificar o token
    const { id, sessionId } = jwt.verify(token, process.env.JWT_SECRET_KEY ?? '') as ITokenPayload;
    return { userId: id, sessionId };
  } catch {
    // Caso o JWT seja inválido ou qualquer outro erro, exigir login novamente
    throw new CustomError({ message: 'Sessão expirada. Faça login novamente', requires_login: true }, 401);
  }
};

const validateUserStatus = (status: STUDENT_STATUS): void => {
  if (status !== STUDENT_STATUS.ACTIVE) {
    throw new CustomError({ message: 'Conta inativa. Entre em contato com o suporte.', requires_login: true }, 401);
  }
};

const resetRequest = (req: Request): void => {
  req.is_authenticated = false;
  req.student = undefined;
  req.session = undefined;
};
