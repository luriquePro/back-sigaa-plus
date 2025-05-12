import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import { IRateLimit, IRequestCounter } from '../interfaces/app.interface.ts';
import { redisClient } from '../models/redis.model.ts';
import { AppRedisRepository } from '../repositories/redis/app.repository.ts';
import { CustomError } from '../utils/apiErros.util.ts';

const appRedisRepository = new AppRedisRepository(redisClient);

const RateLimit =
  ({ timeLimitInSeconds = 30, limitRequestPerTime = 10, messageInError }: IRateLimit = {}) =>
  async (request: Request, response: Response, next: NextFunction) => {
    // get User Data
    const userKey = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const path = request.route?.path;
    const method = request.method;

    // Counter Requests Key
    const key = `rate-limit-${path}-${userKey}-${method}`;

    // Get Request Counter
    const requestCounterJson = await appRedisRepository.getRequestCounter(key);
    if (!requestCounterJson) {
      const requestCounterObject: IRequestCounter = {
        count: 1,
        limit_datetime: moment().utc().add(timeLimitInSeconds, 'seconds').toISOString(),
      };

      // Set a first request counter
      await appRedisRepository.saveRequestCounter(key, requestCounterObject, timeLimitInSeconds);
      next();
      return;
    }

    // Tranform JSON request Counter in Object
    const requestCounterObject: IRequestCounter = JSON.parse(requestCounterJson);
    const newRequestCounterObject: IRequestCounter = {
      count: requestCounterObject.count + 1,
      limit_datetime: requestCounterObject.limit_datetime,
    };

    // Get restTime to EXP
    const restTime = moment(requestCounterObject.limit_datetime).diff(moment().utc(), 'seconds');

    // Inc counter and save
    await appRedisRepository.saveRequestCounter(key, newRequestCounterObject, restTime);

    // Check if time is over
    if (moment(requestCounterObject.limit_datetime).isSameOrAfter(moment().utc())) {
      // Check if limitRequestPerTime is over
      if (requestCounterObject.count >= limitRequestPerTime) {
        throw new CustomError(
          {
            message: messageInError ?? `Too many requests. Please try again in ${restTime} seconds`,
            response: {
              request_counter: newRequestCounterObject.count,
              path,
              method,
              time_remaining: restTime,
            },
          },
          429,
        );
      }
    }

    next();
  };

export { RateLimit };
