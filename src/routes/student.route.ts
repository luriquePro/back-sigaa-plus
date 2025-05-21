import { Router } from 'express';

import { USER_AVATAR_CONFIGS } from '../constants/user.constant.ts';
import { StudentController } from '../controllers/student.controller.ts';
import { authMiddleware } from '../middlewares/authenticate.middleware.ts';
import { RateLimit } from '../middlewares/rate-limit.middleware.ts';
import { CourseModel } from '../models/course.model.ts';
import { SessionModel } from '../models/session.model.ts';
import { StudentModel } from '../models/student.model.ts';
import { MongoCourseRepository } from '../repositories/mongo/course.repository.ts';
import { MongoSessionRepository } from '../repositories/mongo/session.repository.ts';
import { MongoStudentRepository } from '../repositories/mongo/student.repository.ts';
import { SessionService } from '../services/session/session.service.ts';
import { AuthenticateUsecase } from '../usecases/student/authenticate/authenticate.usecase.ts';
import { ShowUsecase } from '../usecases/student/show/show.usecase.ts';
import { UploadAvatarUsecase } from '../usecases/student/upload-avatar/upload-avatar.usecase.ts';

const studentRoutes = Router();

// Repos
const studentRepository = new MongoStudentRepository(StudentModel);
const sessionRepository = new MongoSessionRepository(SessionModel);
const courseRepository = new MongoCourseRepository(CourseModel);

// SESSION
const sessionService = new SessionService(sessionRepository);

// USECASES
const authenticateUsecase = new AuthenticateUsecase(studentRepository, sessionService);
const showUsecase = new ShowUsecase(studentRepository, courseRepository);
const uploadAvatarUsecase = new UploadAvatarUsecase(studentRepository, USER_AVATAR_CONFIGS);

const studentController = new StudentController(authenticateUsecase, showUsecase, uploadAvatarUsecase);

studentRoutes.post('/authenticate', RateLimit({}), studentController.authenticate.bind(studentController));
studentRoutes.get('/show', authMiddleware, RateLimit({}), studentController.show.bind(studentController));
studentRoutes.post('/upload-avatar', authMiddleware, RateLimit({ limitRequestPerTime: 5 }), studentController.uploadAvatar.bind(studentController));

export { studentRoutes };
