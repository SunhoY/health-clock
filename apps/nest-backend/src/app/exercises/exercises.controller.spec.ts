import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

describe('ExercisesController', () => {
  it('should request active body parts', async () => {
    const exercisesService = {
      getBodyParts: jest.fn().mockResolvedValue([
        { id: 'chest', name: '가슴' },
        { id: 'back', name: '등' }
      ]),
      createBodyPart: jest.fn(),
      getExercisesByBodyPartId: jest.fn(),
      createExerciseByBodyPartId: jest.fn(),
      deleteExerciseByCode: jest.fn()
    } as unknown as ExercisesService;

    const controller = new ExercisesController(exercisesService);
    const result = await controller.getBodyParts();

    expect(exercisesService.getBodyParts).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      { id: 'chest', name: '가슴' },
      { id: 'back', name: '등' }
    ]);
  });

  it('should create a new body part', async () => {
    const exercisesService = {
      getBodyParts: jest.fn(),
      getExercisesByBodyPartId: jest.fn(),
      createExerciseByBodyPartId: jest.fn(),
      deleteExerciseByCode: jest.fn(),
      createBodyPart: jest.fn().mockResolvedValue({
        id: 'glutes',
        name: '둔근'
      })
    } as unknown as ExercisesService;

    const controller = new ExercisesController(exercisesService);
    const result = await controller.createBodyPart({
      id: 'glutes',
      name: '둔근',
      sortOrder: 100,
      isActive: true
    });

    expect(exercisesService.createBodyPart).toHaveBeenCalledWith({
      id: 'glutes',
      name: '둔근',
      sortOrder: 100,
      isActive: true
    });
    expect(result).toEqual({ id: 'glutes', name: '둔근' });
  });

  it('should request exercises by body part id', async () => {
    const exercisesService = {
      getBodyParts: jest.fn(),
      createBodyPart: jest.fn(),
      getExercisesByBodyPartId: jest.fn().mockResolvedValue([
        {
          code: 'bench-press',
          name: '벤치프레스',
          bodyPart: 'chest',
          exerciseType: 'strength',
          equipment: ['바벨', '벤치']
        }
      ]),
      createExerciseByBodyPartId: jest.fn(),
      deleteExerciseByCode: jest.fn()
    } as unknown as ExercisesService;

    const controller = new ExercisesController(exercisesService);
    const result = await controller.getExercisesByBodyPart('chest');

    expect(exercisesService.getExercisesByBodyPartId).toHaveBeenCalledWith('chest');
    expect(result).toEqual([
      {
        code: 'bench-press',
        name: '벤치프레스',
        bodyPart: 'chest',
        exerciseType: 'strength',
        equipment: ['바벨', '벤치']
      }
    ]);
  });

  it('should create exercise by body part id', async () => {
    const exercisesService = {
      getBodyParts: jest.fn(),
      createBodyPart: jest.fn(),
      getExercisesByBodyPartId: jest.fn(),
      createExerciseByBodyPartId: jest.fn().mockResolvedValue({
        code: 'decline-bench-press',
        name: '디클라인 벤치프레스',
        bodyPart: 'chest',
        exerciseType: 'strength',
        equipment: ['바벨', '벤치']
      }),
      deleteExerciseByCode: jest.fn()
    } as unknown as ExercisesService;

    const controller = new ExercisesController(exercisesService);
    const result = await controller.createExerciseByBodyPart('chest', {
      code: 'decline-bench-press',
      name: '디클라인 벤치프레스',
      exerciseType: 'strength',
      equipment: ['바벨', '벤치']
    });

    expect(exercisesService.createExerciseByBodyPartId).toHaveBeenCalledWith(
      'chest',
      {
        code: 'decline-bench-press',
        name: '디클라인 벤치프레스',
        exerciseType: 'strength',
        equipment: ['바벨', '벤치']
      }
    );
    expect(result).toEqual({
      code: 'decline-bench-press',
      name: '디클라인 벤치프레스',
      bodyPart: 'chest',
      exerciseType: 'strength',
      equipment: ['바벨', '벤치']
    });
  });

  it('should delete exercise by code', async () => {
    const exercisesService = {
      getBodyParts: jest.fn(),
      createBodyPart: jest.fn(),
      getExercisesByBodyPartId: jest.fn(),
      createExerciseByBodyPartId: jest.fn(),
      deleteExerciseByCode: jest.fn().mockResolvedValue(undefined)
    } as unknown as ExercisesService;

    const controller = new ExercisesController(exercisesService);
    await controller.deleteExerciseByCode('bench-press');

    expect(exercisesService.deleteExerciseByCode).toHaveBeenCalledWith(
      'bench-press'
    );
  });
});
