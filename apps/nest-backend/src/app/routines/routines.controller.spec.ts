import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';

describe('RoutinesController', () => {
  it('should create routine by current user id', async () => {
    const routinesService = {
      getRoutineSummariesByUserId: jest.fn(),
      createRoutineByUserId: jest.fn().mockResolvedValue({
        id: 'routine-1',
        title: '상체 루틴',
        exerciseCount: 2,
        createdAt: '2026-02-17T10:00:00.000Z',
        lastUsedAt: null
      }),
      appendRoutineExerciseByUserId: jest.fn(),
      updateRoutineExerciseByUserId: jest.fn(),
      deleteRoutineByUserId: jest.fn(),
      deleteRoutineExerciseByUserId: jest.fn()
    } as unknown as RoutinesService;

    const controller = new RoutinesController(routinesService);
    const result = await controller.createRoutine(
      {
        title: '상체 루틴',
        exercises: [
          {
            exerciseId: 'bench-press',
            exerciseName: '벤치프레스',
            bodyPart: 'chest',
            sets: 4,
            reps: 8,
            weight: 80
          }
        ]
      },
      {
        id: 'user-1',
        email: 'user@example.com',
        provider: 'google'
      }
    );

    expect(routinesService.createRoutineByUserId).toHaveBeenCalledWith('user-1', {
      title: '상체 루틴',
      exercises: [
        {
          exerciseId: 'bench-press',
          exerciseName: '벤치프레스',
          bodyPart: 'chest',
          sets: 4,
          reps: 8,
          weight: 80
        }
      ]
    });
    expect(result).toEqual({
      id: 'routine-1',
      title: '상체 루틴',
      exerciseCount: 2,
      createdAt: '2026-02-17T10:00:00.000Z',
      lastUsedAt: null
    });
  });

  it('should delete routine by current user id', async () => {
    const routinesService = {
      getRoutineSummariesByUserId: jest.fn(),
      createRoutineByUserId: jest.fn(),
      appendRoutineExerciseByUserId: jest.fn(),
      updateRoutineExerciseByUserId: jest.fn(),
      deleteRoutineByUserId: jest.fn().mockResolvedValue(undefined),
      deleteRoutineExerciseByUserId: jest.fn().mockResolvedValue(undefined)
    } as unknown as RoutinesService;

    const controller = new RoutinesController(routinesService);
    await controller.deleteRoutine('routine-1', {
      id: 'user-1',
      email: 'user@example.com',
      provider: 'google'
    });

    expect(routinesService.deleteRoutineByUserId).toHaveBeenCalledWith(
      'routine-1',
      'user-1'
    );
  });

  it('should delete routine exercise by current user id', async () => {
    const routinesService = {
      getRoutineSummariesByUserId: jest.fn(),
      createRoutineByUserId: jest.fn(),
      appendRoutineExerciseByUserId: jest.fn(),
      updateRoutineExerciseByUserId: jest.fn(),
      deleteRoutineByUserId: jest.fn(),
      deleteRoutineExerciseByUserId: jest.fn().mockResolvedValue(undefined)
    } as unknown as RoutinesService;

    const controller = new RoutinesController(routinesService);
    await controller.deleteRoutineExercise('routine-1', 'routine-exercise-1', {
      id: 'user-1',
      email: 'user@example.com',
      provider: 'google'
    });

    expect(routinesService.deleteRoutineExerciseByUserId).toHaveBeenCalledWith(
      'routine-1',
      'routine-exercise-1',
      'user-1'
    );
  });

  it('should request routine summaries by current user id', async () => {
    const routinesService = {
      getRoutineSummariesByUserId: jest.fn().mockResolvedValue([
        {
          id: 'routine-1',
          title: '상체 루틴',
          exerciseCount: 4,
          exercises: [
            {
              id: 'routine-exercise-1',
              part: 'chest',
              name: '벤치프레스',
              sets: 4
            }
          ],
          createdAt: '2026-02-17T10:00:00.000Z',
          lastUsedAt: null
        }
      ]),
      createRoutineByUserId: jest.fn(),
      appendRoutineExerciseByUserId: jest.fn(),
      updateRoutineExerciseByUserId: jest.fn(),
      deleteRoutineByUserId: jest.fn(),
      deleteRoutineExerciseByUserId: jest.fn()
    } as unknown as RoutinesService;

    const controller = new RoutinesController(routinesService);
    const result = await controller.getRoutines({
      id: 'user-1',
      email: 'user@example.com',
      provider: 'google'
    });

    expect(routinesService.getRoutineSummariesByUserId).toHaveBeenCalledWith('user-1');
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
            sets: 4
          }
        ],
        createdAt: '2026-02-17T10:00:00.000Z',
        lastUsedAt: null
      }
    ]);
  });

  it('should update routine exercise by current user id', async () => {
    const routinesService = {
      getRoutineSummariesByUserId: jest.fn(),
      createRoutineByUserId: jest.fn(),
      appendRoutineExerciseByUserId: jest.fn(),
      updateRoutineExerciseByUserId: jest.fn().mockResolvedValue(undefined),
      deleteRoutineByUserId: jest.fn(),
      deleteRoutineExerciseByUserId: jest.fn()
    } as unknown as RoutinesService;

    const controller = new RoutinesController(routinesService);
    await controller.updateRoutineExercise(
      'routine-1',
      'routine-exercise-1',
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 4,
        weight: 80,
        reps: 8
      },
      {
        id: 'user-1',
        email: 'user@example.com',
        provider: 'google'
      }
    );

    expect(routinesService.updateRoutineExerciseByUserId).toHaveBeenCalledWith(
      'routine-1',
      'routine-exercise-1',
      'user-1',
      expect.objectContaining({
        exerciseId: 'bench-press'
      })
    );
  });

  it('should append routine exercise by current user id', async () => {
    const routinesService = {
      getRoutineSummariesByUserId: jest.fn(),
      createRoutineByUserId: jest.fn(),
      appendRoutineExerciseByUserId: jest.fn().mockResolvedValue({
        id: 'routine-exercise-2'
      }),
      updateRoutineExerciseByUserId: jest.fn(),
      deleteRoutineByUserId: jest.fn(),
      deleteRoutineExerciseByUserId: jest.fn()
    } as unknown as RoutinesService;

    const controller = new RoutinesController(routinesService);
    const result = await controller.appendRoutineExercise(
      'routine-1',
      {
        exerciseId: 'lat-pulldown',
        exerciseName: '렛풀다운',
        bodyPart: 'back',
        sets: 4,
        reps: 10,
        weight: 50
      },
      {
        id: 'user-1',
        email: 'user@example.com',
        provider: 'google'
      }
    );

    expect(routinesService.appendRoutineExerciseByUserId).toHaveBeenCalledWith(
      'routine-1',
      'user-1',
      expect.objectContaining({
        exerciseId: 'lat-pulldown'
      })
    );
    expect(result).toEqual({
      id: 'routine-exercise-2'
    });
  });
});
