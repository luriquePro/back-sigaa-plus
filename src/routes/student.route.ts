import { Router } from 'express';

import { StudentController } from '../controllers/student.controller.ts';
import { RateLimit } from '../middlewares/rate-limit.middleware.ts';
import { SessionModel } from '../models/session.model.ts';
import { StudentModel } from '../models/student.model.ts';
import { MongoSessionRepository } from '../repositories/mongo/session.repository.ts';
import { MongoStudentRepository } from '../repositories/mongo/student.repository.ts';
import { SessionService } from '../services/session/session.service.ts';
import { AuthenticateUsecase } from '../usecases/student/authenticate/authenticate.usecase.ts';

const studentRoutes = Router();

const studentRepository = new MongoStudentRepository(StudentModel);

// SESSION
const SessionRepository = new MongoSessionRepository(SessionModel);
const sessionService = new SessionService(SessionRepository);

// USECASES
const authenticateUsecase = new AuthenticateUsecase(studentRepository, sessionService);

const studentController = new StudentController(authenticateUsecase);

studentRoutes.post('/authenticate', RateLimit({}), studentController.authenticate.bind(studentController));

export { studentRoutes };
