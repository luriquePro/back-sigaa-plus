import { describe, expect, it } from '@jest/globals';

import { isValidCpf } from '../is_valid_cpf.ts';

describe('isValidCpf', () => {
  it('should return true for a valid CPF', () => {
    expect(isValidCpf('52998224725')).toBe(true);
  });

  it('should return false for CPF with all repeated digits', () => {
    expect(isValidCpf('11111111111')).toBe(false);
    expect(isValidCpf('00000000000')).toBe(false);
    expect(isValidCpf('99999999999')).toBe(false);
  });

  it('should return false if the first check digit is incorrect', () => {
    expect(isValidCpf('52998224735')).toBe(false);
  });

  it('should return false if the second check digit is incorrect', () => {
    expect(isValidCpf('52998224724')).toBe(false);
  });

  it('should return false for CPF with less than 11 digits', () => {
    expect(isValidCpf('1234567890')).toBe(false);
  });

  it('should return false for CPF with more than 11 digits', () => {
    expect(isValidCpf('123456789012')).toBe(false);
  });

  it('should return false for CPF containing letters or special characters', () => {
    expect(isValidCpf('abcde123456')).toBe(false);
    expect(isValidCpf('123.456.789-00')).toBe(false);
    expect(isValidCpf('1234567890a')).toBe(false);
  });
});
