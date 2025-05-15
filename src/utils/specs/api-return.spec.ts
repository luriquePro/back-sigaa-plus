import { describe, expect, it } from '@jest/globals';

import { ApiReturn } from '../api-return.ts';

describe('ApiReturn', () => {
  it('should return an object with is_error set to false and the response', () => {
    const response = { data: 'test' };
    const result = ApiReturn(response);

    expect(result.is_error).toBe(false);
    expect(result.response).toEqual(response);
  });
});
