import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import { COURSE_LEVEL, COURSE_MODALITY, COURSE_SHIFT } from '../../../interfaces/course.interface.ts';
import { IStudentDTO, IStudentRepository } from '../../../interfaces/student.interface.ts';

import { IShowUsecase } from './show.interface.ts';
import { ShowUsecase } from './show.usecase.ts';

jest.mock('../../../utils/api-return', () => ({
  ApiReturn: jest.fn(data => ({ success: true, data })),
}));

jest.mock('./show.validation.ts', () => ({ ShowValidation: jest.fn() }));

describe('Show Usecase Suite', () => {
  let usecase: IShowUsecase;
  const studentRepository = {
    findOneByObj: jest.fn(),
  } as unknown as jest.Mocked<IStudentRepository>;

  const mockStudent: Partial<IStudentDTO> = {
    id: '123e4567-e89b-12d3-a456-426655440000',
    name: 'John Doe',
    email: 'john@example.com',
    cpf: '12345678900',
    password: 'hashed-password',
    course: {
      code: '123',
      name: 'Course Name',
      label: 'Course Description',
      duration_in_semesters: 2,
      current_semester: 1,
      completed_hours: 0,
      workload: 1200,
      id: '1',
      modality: COURSE_MODALITY.EAD,
      shift: COURSE_SHIFT.AFTERNOON,
      level: COURSE_LEVEL.TECHNOLOGIST,
    },
  };

  beforeEach(() => {
    usecase = new ShowUsecase(studentRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should throw NotFoundError if student is not found', async () => {
    studentRepository.findOneByObj.mockResolvedValue(null);

    await expect(usecase.execute({ id: mockStudent.id! })).rejects.toThrow(
      'Não foi possivel encontrar um aluno associado ao id informado em nossos sistemas.',
    );

    expect(studentRepository.findOneByObj).toHaveBeenCalledWith({ id: mockStudent.id! });
  });

  it('should return student data if student exists', async () => {
    studentRepository.findOneByObj.mockResolvedValue(mockStudent as IStudentDTO);

    const result = await usecase.execute({ id: mockStudent.id! });

    expect(studentRepository.findOneByObj).toHaveBeenCalledWith({ id: mockStudent.id });

    expect(result).toEqual({
      is_error: false,
      response: {
        id: mockStudent.id,
        name: mockStudent.name,
        course: mockStudent.course,
      },
    });
  });
});
