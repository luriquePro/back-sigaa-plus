import { describe, expect, it } from '@jest/globals';

import { GenerateRandomid } from '../generate-random-id.ts';

describe('GenerateRandomid', () => {
  it('should generate a uuid v4', () => {
    const result = GenerateRandomid();
    expect(result).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
  });
});
