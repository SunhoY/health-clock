import { BadRequestException, ConflictException } from '@nestjs/common';
import { ExercisesRepository } from './exercises.repository';
import { ExercisesService } from './exercises.service';

describe('ExercisesService', () => {
  it('should return active body parts', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyParts: jest.fn().mockResolvedValue([
        {
          id: 'chest',
          name: '가슴',
          sortOrder: 10,
          isActive: true,
          createdAt: new Date('2026-02-17T10:00:00.000Z')
        }
      ]),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn()
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);
    const result = await service.getBodyParts();

    expect(exercisesRepository.ensureDefaultBodyParts).toHaveBeenCalledTimes(1);
    expect(exercisesRepository.findActiveBodyParts).toHaveBeenCalledTimes(1);
    expect(result).toEqual([{ id: 'chest', name: '가슴' }]);
  });

  it('should create body part with normalized id and trimmed name', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyParts: jest.fn(),
      existsByIdOrName: jest.fn().mockResolvedValue(false),
      createBodyPart: jest.fn().mockResolvedValue({
        id: 'glutes',
        name: '둔근',
        sortOrder: 100,
        isActive: true,
        createdAt: new Date('2026-02-17T10:00:00.000Z')
      })
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);
    const result = await service.createBodyPart({
      id: ' Glutes ',
      name: ' 둔근 '
    });

    expect(exercisesRepository.createBodyPart).toHaveBeenCalledWith({
      id: 'glutes',
      name: '둔근',
      sortOrder: undefined,
      isActive: true
    });
    expect(result).toEqual({ id: 'glutes', name: '둔근' });
  });

  it('should reject invalid body part id', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyParts: jest.fn(),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn()
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);

    await expect(
      service.createBodyPart({
        id: 'Upper Body',
        name: '상체'
      })
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(exercisesRepository.createBodyPart).not.toHaveBeenCalled();
  });

  it('should throw conflict when body part already exists', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyParts: jest.fn(),
      existsByIdOrName: jest.fn().mockResolvedValue(true),
      createBodyPart: jest.fn()
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);

    await expect(
      service.createBodyPart({
        id: 'glutes',
        name: '둔근'
      })
    ).rejects.toBeInstanceOf(ConflictException);
    expect(exercisesRepository.createBodyPart).not.toHaveBeenCalled();
  });
});
