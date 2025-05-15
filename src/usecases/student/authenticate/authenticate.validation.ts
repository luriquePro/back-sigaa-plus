import { AnyObject, string } from 'yup';

import { isValidCpf } from '../../../utils/is_valid_cpf.ts';
import { isValidEmail } from '../../../utils/is_valid_email.ts';
import { YupValidate } from '../../../utils/yup_validate.ts';

import { IAuthenticateEntryDTO } from './authenticate.interface.ts';

const AuthenticateValidation = (data: IAuthenticateEntryDTO): void => {
  const shape: AnyObject = {
    login: string()
      .min(3, 'Seu Usuario precisa ter pelo menos 3 caracteres')
      .required('Login é obrigatório')
      .test('is-valid-login', 'Login inválido', function (value) {
        const { path, createError } = this;

        const isOnlyDigits = /^\d+$/.test(value);

        if (isOnlyDigits && value.length !== 11 && value.length !== 14) {
          return createError({ path, message: 'O CPF deve ter 11 dígitos' });
        } else if (isOnlyDigits && (value.length === 11 || value.length === 14)) {
          const digits = value.replace(/\D/g, '');

          if (!isValidCpf(digits)) return createError({ path, message: 'O CPF informado é inválido' });

          return true;
        } else if (value.includes('@')) {
          try {
            string()
              .email('Informe um E-mail válido')
              .required('Informe um E-mail válido')
              .test('email', 'Informe um E-mail válido', value => isValidEmail(value))
              .validateSync(value);

            return true;
          } catch (err: unknown) {
            const error = err as { message: string };
            return createError({ path, message: error.message || 'E-mail inválido' });
          }
        }

        return createError({ path, message: 'Informe um CPF ou E-mail válido' });
      }),
    password: string().required('Senha é obrigatória'),
  };

  YupValidate(shape, data);
};

export { AuthenticateValidation };
