import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { validateIndexHelloWorld } from './hello-world.validation.ts';

describe('validateIndexHelloWorld', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should call YupValidate with the correct shape and data', () => {
    const params = { message: 'Olá Mundo!' };

    expect(() => validateIndexHelloWorld(params)).not.toThrow();
  });

  it('should throw an error when message is not a string', () => {
    const params = { message: true as unknown as string };

    expect(() => validateIndexHelloWorld(params)).toThrow('message must be a `string` type, but the final value was: `true`.');
  });
});
