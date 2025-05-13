import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { IAuthenticateEntryDTO } from './authenticate.interface.ts';
import { AuthenticateValidation } from './authenticate.validation.ts';

describe('Authenticate Validation Suite', () => {
  const validPassword = 'Password1@';

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should accept valid email login', () => {
    const data: IAuthenticateEntryDTO = { login: 'user@example.com', password: validPassword };
    expect(() => AuthenticateValidation(data)).not.toThrow();
  });

  it('should reject invalid email login', () => {
    const data: IAuthenticateEntryDTO = { login: 'user@invalid', password: validPassword };
    expect(() => AuthenticateValidation(data)).toThrow('Informe um E-mail válido');
  });

  it('should accept valid CPF login', () => {
    const data: IAuthenticateEntryDTO = { login: '12345678909', password: validPassword };
    expect(() => AuthenticateValidation(data)).not.toThrow();
  });

  it('should reject CPF login with wrong length', () => {
    const data: IAuthenticateEntryDTO = { login: '1234567890', password: validPassword };
    expect(() => AuthenticateValidation(data)).toThrow('O CPF deve ter 11 dígitos');
  });

  it('should reject CPF login with invalid characters', () => {
    const data: IAuthenticateEntryDTO = { login: '12345678abc', password: validPassword };
    expect(() => AuthenticateValidation(data)).toThrow('Informe um CPF ou E-mail válido');
  });

  it('should reject CPF login with invalid check digits', () => {
    const data: IAuthenticateEntryDTO = { login: '12345678900', password: validPassword };
    expect(() => AuthenticateValidation(data)).toThrow('O CPF informado é inválido');
  });

  it('should reject login that is not CPF or email or username', () => {
    const data: IAuthenticateEntryDTO = { login: '!!@@##', password: validPassword };
    expect(() => AuthenticateValidation(data)).toThrow('Informe um E-mail válido');
  });

  it('should reject login shorter than 3 characters', () => {
    const data: IAuthenticateEntryDTO = { login: 'ab', password: validPassword };
    expect(() => AuthenticateValidation(data)).toThrow('Seu Usuario precisa ter pelo menos 3 caracteres');
  });

  it('should reject missing login', () => {
    const data = { password: validPassword } as unknown as IAuthenticateEntryDTO;
    expect(() => AuthenticateValidation(data)).toThrow('Login é obrigatório');
  });

  it('should reject missing password', () => {
    const data = { login: 'user@example.com' } as unknown as IAuthenticateEntryDTO;
    expect(() => AuthenticateValidation(data)).toThrow('Senha é obrigatória');
  });

  it('should accept valid login and password', () => {
    const data: IAuthenticateEntryDTO = { login: 'user@example.com', password: 'ValidPass1@' };
    expect(() => AuthenticateValidation(data)).not.toThrow();
  });
});
