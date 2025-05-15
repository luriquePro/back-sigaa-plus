import { describe, expect, it } from '@jest/globals';

import { toPascalCase } from '../to_pascal_case.ts';

describe('toPascalCase', () => {
  it('should convert space separated words to PascalCase', () => {
    expect(toPascalCase('hello world')).toBe('HelloWorld');
  });

  it('should convert hyphen separated words to PascalCase', () => {
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
  });

  it('should convert underscore separated words to PascalCase', () => {
    expect(toPascalCase('hello_world')).toBe('HelloWorld');
  });

  it('should convert camelCase to PascalCase', () => {
    expect(toPascalCase('helloWorld')).toBe('HelloWorld');
  });

  it('should handle empty strings', () => {
    expect(toPascalCase('')).toBe('');
  });

  it('should handle single word', () => {
    expect(toPascalCase('hello')).toBe('Hello');
  });
});
