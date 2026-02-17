import {
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
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
      findActiveBodyPartById: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn(),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn(),
      createExercise: jest.fn(),
      deactivateExerciseByCode: jest.fn()
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
      findActiveBodyPartById: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn(),
      existsByIdOrName: jest.fn().mockResolvedValue(false),
      createBodyPart: jest.fn().mockResolvedValue({
        id: 'glutes',
        name: '둔근',
        sortOrder: 100,
        isActive: true,
        createdAt: new Date('2026-02-17T10:00:00.000Z')
      }),
      createExercise: jest.fn(),
      deactivateExerciseByCode: jest.fn()
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
      findActiveBodyPartById: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn(),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn(),
      createExercise: jest.fn(),
      deactivateExerciseByCode: jest.fn()
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
      findActiveBodyPartById: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn(),
      existsByIdOrName: jest.fn().mockResolvedValue(true),
      createBodyPart: jest.fn(),
      createExercise: jest.fn(),
      deactivateExerciseByCode: jest.fn()
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

  it('should return active exercises by body part id', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyPartById: jest.fn().mockResolvedValue({
        id: 'chest',
        name: '가슴',
        sortOrder: 10,
        isActive: true,
        createdAt: new Date('2026-02-17T10:00:00.000Z')
      }),
      findActiveBodyParts: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn().mockResolvedValue([
        {
          code: 'bench-press',
          name: '벤치프레스',
          bodyPart: 'chest',
          exerciseType: 'strength',
          equipment: ['바벨', '벤치'],
          difficulty: 'intermediate'
        }
      ]),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn(),
      createExercise: jest.fn(),
      deactivateExerciseByCode: jest.fn()
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);
    const result = await service.getExercisesByBodyPartId('chest');

    expect(exercisesRepository.findActiveBodyPartById).toHaveBeenCalledWith('chest');
    expect(exercisesRepository.findActiveExercisesByBodyPart).toHaveBeenCalledWith(
      'chest'
    );
    expect(result).toEqual([
      {
        code: 'bench-press',
        name: '벤치프레스',
        bodyPart: 'chest',
        exerciseType: 'strength',
        equipment: ['바벨', '벤치'],
        difficulty: 'intermediate'
      }
    ]);
  });

  it('should create exercise by body part id', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyPartById: jest.fn().mockResolvedValue({
        id: 'chest',
        name: '가슴',
        sortOrder: 10,
        isActive: true,
        createdAt: new Date('2026-02-17T10:00:00.000Z')
      }),
      findActiveBodyParts: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn(),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn(),
      createExercise: jest.fn().mockResolvedValue({
        code: 'decline-bench-press',
        name: '디클라인 벤치프레스',
        bodyPart: 'chest',
        exerciseType: 'strength',
        equipment: ['바벨', '벤치'],
        difficulty: null
      }),
      deactivateExerciseByCode: jest.fn()
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);
    const result = await service.createExerciseByBodyPartId('chest', {
      code: 'decline-bench-press',
      name: '디클라인 벤치프레스',
      exerciseType: 'strength',
      equipment: ['바벨', '벤치']
    });

    expect(exercisesRepository.createExercise).toHaveBeenCalledWith({
      code: 'decline-bench-press',
      name: '디클라인 벤치프레스',
      bodyPart: 'chest',
      exerciseType: 'strength',
      equipment: ['바벨', '벤치'],
      difficulty: undefined
    });
    expect(result).toEqual({
      code: 'decline-bench-press',
      name: '디클라인 벤치프레스',
      bodyPart: 'chest',
      exerciseType: 'strength',
      equipment: ['바벨', '벤치'],
      difficulty: undefined
    });
  });

  it('should reject exercise lookup when body part is missing', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyPartById: jest.fn().mockResolvedValue(null),
      findActiveBodyParts: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn(),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn(),
      createExercise: jest.fn(),
      deactivateExerciseByCode: jest.fn()
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);

    await expect(service.getExercisesByBodyPartId('unknown')).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it('should soft delete exercise by code', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyPartById: jest.fn(),
      findActiveBodyParts: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn(),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn(),
      createExercise: jest.fn(),
      deactivateExerciseByCode: jest.fn().mockResolvedValue(true)
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);
    await service.deleteExerciseByCode('bench-press');

    expect(exercisesRepository.deactivateExerciseByCode).toHaveBeenCalledWith(
      'bench-press'
    );
  });

  it('should throw not found when deleting missing exercise', async () => {
    const exercisesRepository = {
      ensureDefaultBodyParts: jest.fn().mockResolvedValue(undefined),
      findActiveBodyPartById: jest.fn(),
      findActiveBodyParts: jest.fn(),
      findActiveExercisesByBodyPart: jest.fn(),
      existsByIdOrName: jest.fn(),
      createBodyPart: jest.fn(),
      createExercise: jest.fn(),
      deactivateExerciseByCode: jest.fn().mockResolvedValue(false)
    } as unknown as ExercisesRepository;

    const service = new ExercisesService(exercisesRepository);

    await expect(service.deleteExerciseByCode('bench-press')).rejects.toBeInstanceOf(
      NotFoundException
    );
  });
});
