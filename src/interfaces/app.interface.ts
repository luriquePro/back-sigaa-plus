interface IDefaultReturn<T> {
  is_error: boolean;
  message?: string;
  status_code?: number;
  response?: T;
}

interface IRequestCounter {
  count: number;
  limit_datetime: string;
}

interface IRateLimit {
  timeLimitInSeconds?: number;
  limitRequestPerTime?: number;
  messageInError?: string;
}

interface IDefaultReturn<T> {
  is_error: boolean;
  message?: string;
  response?: T;
}

interface IAppRedisRepository {
  getRequestCounter(key: string): Promise<string | null>;
  saveRequestCounter(key: string, requestCounter: IRequestCounter, timeEXP: number): Promise<void>;
}

export type { IAppRedisRepository, IDefaultReturn, IRateLimit, IRequestCounter };
