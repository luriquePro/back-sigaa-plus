import { describe, expect, it } from '@jest/globals';
import { AnyObject, string } from 'yup';

import { CustomError } from '../api-erros.ts';
import { YupValidate } from '../yup_validate.ts';

describe('YupValidate', () => {
  const shape: AnyObject = { name: string().required('name is a required field') };

  it('should validate data successfully with correct shape', () => {
    const data = { name: 'John Doe' };

    expect(() => YupValidate(shape, data)).not.toThrow();
  });

  it('should throw CustomError with validation error message when data is invalid', () => {
    try {
      YupValidate(shape, {});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      expect(error).toBeInstanceOf(CustomError);
      expect(error.message).toContain('name is a required field');
      expect(error).toHaveProperty('statusCode', 422);
    }
  });
});
