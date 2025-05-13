import { describe, expect, it } from '@jest/globals';

import { isValidEmail } from './isValidEmail.ts';

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('john.doe@example.com')).toBe(true);
    expect(isValidEmail('user123@domain.co')).toBe(true);
    expect(isValidEmail('name.surname@sub.domain.com')).toBe(true);
    expect(isValidEmail('email+alias@gmail.com')).toBe(true);
    expect(isValidEmail('test_email@my-company.io')).toBe(true);
  });

  it('should return false for missing "@" symbol', () => {
    expect(isValidEmail('johndoeexample.com')).toBe(false);
  });

  it('should return false for missing domain name', () => {
    expect(isValidEmail('john.doe@')).toBe(false);
  });

  it('should return false for missing username', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('should return false for missing top-level domain', () => {
    expect(isValidEmail('john.doe@example')).toBe(false);
  });

  it('should return false for multiple "@" symbols', () => {
    expect(isValidEmail('john@@example.com')).toBe(false);
  });

  it('should return false for spaces in email', () => {
    expect(isValidEmail('john doe@example.com')).toBe(false);
    expect(isValidEmail('john.doe@ example.com')).toBe(false);
    expect(isValidEmail('john.doe@exam ple.com')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isValidEmail(null as unknown as string)).toBe(false);
    expect(isValidEmail(undefined as unknown as string)).toBe(false);
  });
});
