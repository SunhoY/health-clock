import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RoutinesRepository } from './routines.repository';
import { RoutinesService } from './routines.service';

describe('RoutinesService', () => {
  it('should create routine for authenticated user', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn(),
      findExercisesByCodes: jest.fn().mockResolvedValue([
        { id: 'exercise-1', code: 'bench-press' }
      ]),
      createByUserId: jest.fn().mockResolvedValue({
        id: 'routine-1',
        title: '상체 루틴',
        exerciseCount: 1,
        createdAt: new Date('2026-02-17T10:00:00.000Z'),
        lastUsedAt: null
      }),
      deleteByRoutineIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseCodeAndUserId: jest.fn()
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);
    const result = await service.createRoutineByUserId('user-1', {
      title: '상체 루틴',
      exercises: [
        {
          exerciseId: 'bench-press',
          exerciseName: '벤치프레스',
          bodyPart: 'chest',
          sets: 4,
          reps: 8,
          weight: 80,
          setDetails: [
            { setNumber: 1, reps: 8, weight: 80 },
            { setNumber: 2, reps: 8, weight: 80 },
            { setNumber: 3, reps: 8, weight: 80 },
            { setNumber: 4, reps: 8, weight: 80 }
          ]
        }
      ]
    });

    expect(routinesRepository.findExercisesByCodes).toHaveBeenCalledWith([
      'bench-press'
    ]);
    expect(routinesRepository.createByUserId).toHaveBeenCalledWith('user-1', {
      title: '상체 루틴',
      exercises: [
        {
          exerciseId: 'exercise-1',
          metricType: 'set_based',
          targetSets: 4,
          targetReps: 8,
          targetWeightKg: 80,
          restSeconds: 60,
          targetDurationSeconds: undefined,
          setDetails: [
            { setNo: 1, targetReps: 8, targetWeightKg: 80 },
            { setNo: 2, targetReps: 8, targetWeightKg: 80 },
            { setNo: 3, targetReps: 8, targetWeightKg: 80 },
            { setNo: 4, targetReps: 8, targetWeightKg: 80 }
          ]
        }
      ]
    });
    expect(result).toEqual({
      id: 'routine-1',
      title: '상체 루틴',
      exerciseCount: 1,
      createdAt: '2026-02-17T10:00:00.000Z',
      lastUsedAt: null
    });
  });

  it('should reject routine creation when exercise code is unknown', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn(),
      findExercisesByCodes: jest.fn().mockResolvedValue([]),
      createByUserId: jest.fn(),
      deleteByRoutineIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseCodeAndUserId: jest.fn()
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);

    await expect(
      service.createRoutineByUserId('user-1', {
        title: '상체 루틴',
        exercises: [
          {
            exerciseId: 'unknown-code',
            exerciseName: '없는 운동',
            bodyPart: 'chest',
            sets: 3,
            reps: 10
          }
        ]
      })
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(routinesRepository.createByUserId).not.toHaveBeenCalled();
  });

  it('should delete the routine for the authenticated user', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn(),
      findExercisesByCodes: jest.fn(),
      createByUserId: jest.fn(),
      deleteByRoutineIdAndUserId: jest.fn().mockResolvedValue(true),
      deleteExerciseByRoutineIdAndExerciseIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseCodeAndUserId: jest.fn()
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);
    await service.deleteRoutineByUserId('routine-1', 'user-1');

    expect(routinesRepository.deleteByRoutineIdAndUserId).toHaveBeenCalledWith(
      'routine-1',
      'user-1'
    );
  });

  it('should delete routine exercise for the authenticated user', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn(),
      findExercisesByCodes: jest.fn(),
      createByUserId: jest.fn(),
      deleteByRoutineIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseIdAndUserId: jest
        .fn()
        .mockResolvedValue(true),
      deleteExerciseByRoutineIdAndExerciseCodeAndUserId: jest.fn()
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);
    await service.deleteRoutineExerciseByUserId(
      'routine-1',
      'routine-exercise-1',
      'user-1'
    );

    expect(
      routinesRepository.deleteExerciseByRoutineIdAndExerciseIdAndUserId
    ).toHaveBeenCalledWith('routine-1', 'routine-exercise-1', 'user-1');
  });

  it('should delete routine exercise by exercise code when id lookup misses', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn(),
      findExercisesByCodes: jest.fn(),
      createByUserId: jest.fn(),
      deleteByRoutineIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseIdAndUserId: jest
        .fn()
        .mockResolvedValue(false),
      deleteExerciseByRoutineIdAndExerciseCodeAndUserId: jest
        .fn()
        .mockResolvedValue(true)
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);
    await service.deleteRoutineExerciseByUserId('routine-1', 'bench-press', 'user-1');

    expect(
      routinesRepository.deleteExerciseByRoutineIdAndExerciseIdAndUserId
    ).toHaveBeenCalledWith('routine-1', 'bench-press', 'user-1');
    expect(
      routinesRepository.deleteExerciseByRoutineIdAndExerciseCodeAndUserId
    ).toHaveBeenCalledWith('routine-1', 'bench-press', 'user-1');
  });

  it('should throw not found when routine exercise deletion target is missing', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn(),
      findExercisesByCodes: jest.fn(),
      createByUserId: jest.fn(),
      deleteByRoutineIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseIdAndUserId: jest
        .fn()
        .mockResolvedValue(false),
      deleteExerciseByRoutineIdAndExerciseCodeAndUserId: jest
        .fn()
        .mockResolvedValue(false)
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);

    await expect(
      service.deleteRoutineExerciseByUserId(
        'routine-1',
        'routine-exercise-404',
        'user-1'
      )
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should return mapped routine summaries for the authenticated user', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn().mockResolvedValue([
        {
          id: 'routine-1',
          title: '상체 루틴',
          exerciseCount: 4,
          exercises: [
            {
              id: 'routine-exercise-1',
              part: 'chest',
              name: '벤치프레스',
              sets: 4,
              weight: '80.00',
              reps: 8,
              duration: null
            }
          ],
          createdAt: new Date('2026-02-17T10:00:00.000Z'),
          lastUsedAt: new Date('2026-02-16T18:10:00.000Z')
        }
      ]),
      findExercisesByCodes: jest.fn(),
      createByUserId: jest.fn(),
      deleteByRoutineIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseIdAndUserId: jest.fn(),
      deleteExerciseByRoutineIdAndExerciseCodeAndUserId: jest.fn()
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);
    const result = await service.getRoutineSummariesByUserId('user-1');

    expect(routinesRepository.findSummariesByUserId).toHaveBeenCalledWith('user-1');
    expect(result).toEqual([
      {
        id: 'routine-1',
        title: '상체 루틴',
        exerciseCount: 4,
        exercises: [
          {
            id: 'routine-exercise-1',
            part: 'chest',
            name: '벤치프레스',
            sets: 4,
            weight: 80,
            reps: 8,
            duration: undefined
          }
        ],
        createdAt: '2026-02-17T10:00:00.000Z',
        lastUsedAt: '2026-02-16T18:10:00.000Z'
      }
    ]);
  });
});
