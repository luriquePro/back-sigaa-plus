import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { IndexHelloWorldUsecase } from './hello-world.usecase.ts';

describe('IndexHelloWorldUsecase', () => {
  let usecase: IndexHelloWorldUsecase;

  beforeEach(() => {
    usecase = new IndexHelloWorldUsecase();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should return the provided message', async () => {
    const params = { message: 'Olá Mundo!' };

    const result = await usecase.execute(params);

    expect(result).toEqual({ message: 'Olá Mundo!' });
  });

  it('should return default message when none is provided', async () => {
    const params = { message: undefined };

    const result = await usecase.execute(params);

    expect(result).toEqual({ message: 'Hello World' });
  });
});
