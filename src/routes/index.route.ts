import { Router } from 'express';

import { IndexController } from '../controllers/index.controller.ts';
import { RateLimit } from '../middlewares/RateLimit.middleware.ts';
import { IndexHelloWorldUsecase } from '../usecases/index/hello-world/hello-world.usecase.ts';

const IndexRoutes = Router();

const indexHelloWorldUsecase = new IndexHelloWorldUsecase();
const indexController = new IndexController(indexHelloWorldUsecase);

IndexRoutes.get('/', RateLimit(), indexController.helloWorld.bind(indexController));

export { IndexRoutes };
