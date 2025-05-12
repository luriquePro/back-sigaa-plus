import cors from 'cors';
import 'dotenv/config';
import express, { Application } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { errorMiddleware } from './middlewares/error.middleware.ts';
import { Routes } from './routes.ts';

class App {
  private readonly application: Application;
  private readonly FORMAT_MESSAGE_ON_ERROR = process.env.FORMAT_MESSAGE_ON_ERROR === 'true';

  constructor() {
    this.application = express();
    this.config();
  }

  public listen(port: number, cb?: () => void): void {
    this.application.listen(port, cb);
  }

  private config(): void {
    this.application.use(
      cors({
        origin: (origin, callback) => {
          const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      }),
    );

    this.application.use(express.json());

    this.application.disable('X-Powered-By');

    this.application.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", 'data:', 'https://framerusercontent.com'],
            upgradeInsecureRequests: [],
            workerSrc: ["'self'", 'blob:'],
          },
        },
      }),
    );

    this.application.use(helmet.xssFilter());

    mongoose
      .connect(process.env.MONGODB_URL!, { dbName: process.env.MONGODB_NAME! })
      // eslint-disable-next-line no-console
      .then(() => console.log('DB connected'))
      // eslint-disable-next-line no-console
      .catch(() => console.log('DB connection error'));

    this.application.use(Routes);

    if (this.FORMAT_MESSAGE_ON_ERROR) {
      this.application.use(errorMiddleware);
    }

    console.log(process.env.MONGODB_URL, process.env.MONGODB_NAME, process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_DB);
  }
}

export { App };
