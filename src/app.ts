import cors from 'cors';
import 'dotenv/config';
import express, { Application } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { errorMiddleware } from './middlewares/error.middleware.ts';
import { Routes } from './routes.ts';
import { CustomError } from './utils/api-erros.ts';

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
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

    this.application.use(
      cors({
        origin: (origin, callback) => {
          console.log('Requisição vinda de:', origin);

          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(
              new CustomError(
                {
                  message: `Origem de acesso ${origin} não permitida.`,
                  cors_block: true,
                },
                403,
              ),
            );
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
            defaultSrc: ["'self'", ...allowedOrigins],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com', ...allowedOrigins],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              'https://fonts.googleapis.com',
              'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/',
              ...allowedOrigins,
            ],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', ...allowedOrigins],
            objectSrc: ["'none'"],
            imgSrc: ["'self'", 'data:', 'https://framerusercontent.com', ...allowedOrigins],
            upgradeInsecureRequests: [],
            workerSrc: ["'self'", 'blob:', ...allowedOrigins],
          },
        },
      }),
    );

    this.application.use(helmet.xssFilter());

    this.application.use((req, res, next) => {
      res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    });

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

    this.application.use(
      '/tmp',
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
      express.static('public/tmp'),
    );
  }
}

export { App };
