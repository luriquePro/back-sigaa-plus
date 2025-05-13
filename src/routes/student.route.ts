import { Router } from 'express';

import { StudentController } from '../controllers/student.controller.ts';
import { RateLimit } from '../middlewares/RateLimit.middleware.ts';
import { StudentModel } from '../models/student.model.ts';
import { MongoStudentRepository } from '../repositories/mongo/student.repository.ts';
import { AuthenticateUsecase } from '../usecases/student/authenticate/authenticate.usecase.ts';

const studentRoutes = Router();

const studentRepository = new MongoStudentRepository(StudentModel);

const authenticateUsecase = new AuthenticateUsecase(studentRepository);

const studentController = new StudentController(authenticateUsecase);

studentRoutes.post('/authenticate', RateLimit({}), studentController.authenticate.bind(studentController));

export { studentRoutes };
