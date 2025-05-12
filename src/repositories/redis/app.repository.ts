import { RedisClientType } from 'redis';

import { IAppRedisRepository, IRequestCounter } from '../../interfaces/app.interface.ts';

class AppRedisRepository implements IAppRedisRepository {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly redisClient: RedisClientType<any>) {
    // eslint-disable-next-line no-console
    this.redisClient.on('error', err => console.log('Redis Client Error', err));

    if (!this.redisClient.isOpen) {
      this.redisClient
        .connect()
        // eslint-disable-next-line no-console
        .then(() => console.log('Connected to Redis'))
        // eslint-disable-next-line no-console
        .catch(() => console.log('Error to connect to Redis'));
    }
  }

  public async getRequestCounter(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  public async saveRequestCounter(key: string, requestCounter: IRequestCounter, timeEXP: number): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(requestCounter), { EX: timeEXP });
  }
}

export { AppRedisRepository };
