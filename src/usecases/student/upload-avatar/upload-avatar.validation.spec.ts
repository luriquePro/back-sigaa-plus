import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { File } from 'formidable';

import { USER_AVATAR_CONFIGS } from '../../../constants/user.constant.ts';

import { IUploadAvatarEntryDTO } from './upload-avatar.interface.ts';
import { UploadAvatarValidation } from './upload-avatar.validation.ts';

describe('UploadAvatar Validation Suite', () => {
  const createFileStub = (): Partial<File> => ({
    filepath: '/tmp/avatar.png',
    originalFilename: 'avatar.png',
    mimetype: 'image/png',
    size: 1024,
    newFilename: 'avatar.png',
    hash: '',
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should accept valid data', () => {
    const params = { studentId: '123e4567-e89b-12d3-a456-426655440000', avatar: createFileStub() };
    expect(() => UploadAvatarValidation(params as unknown as IUploadAvatarEntryDTO)).not.toThrow();
  });

  it('should reject missing studentId', () => {
    const params = { avatar: createFileStub() };
    expect(() => UploadAvatarValidation(params as unknown as IUploadAvatarEntryDTO)).toThrow("O parâmetro 'studentId' é obrigatório");
  });

  it('should reject invalid studentId', () => {
    const params = { studentId: 'invalid-uuid', avatar: createFileStub() };
    expect(() => UploadAvatarValidation(params as unknown as IUploadAvatarEntryDTO)).toThrow("O parâmetro 'studentId' é inválido");
  });

  it('should reject missing avatar', () => {
    const params = { studentId: '123e4567-e89b-12d3-a456-426655440000' };
    expect(() => UploadAvatarValidation(params as unknown as IUploadAvatarEntryDTO)).toThrow("O parâmetro 'avatar' é obrigatório");
  });

  it('should reject invalid avatar', () => {
    const params = { studentId: '123e4567-e89b-12d3-a456-426655440000', avatar: {} };
    expect(() => UploadAvatarValidation(params as unknown as IUploadAvatarEntryDTO)).toThrow('O parâmetro avatar precisa ser um arquivo');
  });

  it('should reject invalid avatar extension', () => {
    const params = { studentId: '123e4567-e89b-12d3-a456-426655440000', avatar: createFileStub() };

    params.avatar.mimetype = 'image/invalid-extesion';

    expect(() => UploadAvatarValidation(params as unknown as IUploadAvatarEntryDTO)).toThrow(
      'A extensão do arquivo precisa ser png, jpg, jpeg ou gif',
    );
  });

  it('should reject invalid avatar size', () => {
    const params = { studentId: '123e4567-e89b-12d3-a456-426655440000', avatar: createFileStub() };

    params.avatar.size = 100 * 1024 * 1024;

    expect(() => UploadAvatarValidation(params as unknown as IUploadAvatarEntryDTO)).toThrow(
      `O tamanho do arquivo precisa ser menor que ${USER_AVATAR_CONFIGS.MAX_SIZE / 1024 / 1024}MB`,
    );
  });
});
