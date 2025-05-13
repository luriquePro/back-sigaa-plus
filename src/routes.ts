import express from 'express';

import { IndexRoutes } from './routes/index.route.ts';
import { studentRoutes } from './routes/student.route.ts';

const Routes = express();

Routes.use('/index', IndexRoutes);
Routes.use('/students', studentRoutes);

export { Routes };
