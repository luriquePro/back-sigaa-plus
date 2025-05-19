import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { ShowValidation } from './show.validation.ts';

describe('Show Validation Suite', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should accept valid id', () => {
    const params = { id: '123e4567-e89b-12d3-a456-426655440000' };
    expect(() => ShowValidation(params)).not.toThrow();
  });

  it('should reject missing id', () => {
    const params = { id: undefined };
    expect(() => ShowValidation(params)).toThrow("O parâmetro 'id' é obrigatório");
  });

  it('should reject invalid id', () => {
    const params = { id: 'invalid-id' };
    expect(() => ShowValidation(params)).toThrow("O parâmetro 'id' é inválido");
  });
});
