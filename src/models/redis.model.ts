import { createClient } from 'redis';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const redisClient: any = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  database: Number(process.env.REDIS_DB),
});

export { redisClient };
