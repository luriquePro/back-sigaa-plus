import express from 'express';

import { IndexRoutes } from './routes/index.route.ts';

const Routes = express();

Routes.use('/index', IndexRoutes);

export { Routes };
