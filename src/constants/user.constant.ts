import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { StudentAvatarSize } from '../interfaces/student.interface.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface IUserAvatarConfigs {
  FILE_EXTENSIONS: string[];
  MAX_SIZE: number;
  IMAGE_SIZES: Record<StudentAvatarSize, number>;
  TMP_FOLDER: string;
}

const USER_AVATAR_CONFIGS = {
  FILE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif'],
  MAX_SIZE: 1 * 1024 * 1024, // 1MB,
  IMAGE_SIZES: {
    xs: 15,
    sm: 25,
    md: 50,
    lg: 75,
    xl: 100,
  },
  TMP_FOLDER: path.resolve(__dirname, '..', '..', 'public', 'tmp'),
};

export { USER_AVATAR_CONFIGS };

export type { IUserAvatarConfigs };
