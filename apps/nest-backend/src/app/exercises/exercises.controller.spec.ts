import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';

describe('ExercisesController', () => {
  it('should request active body parts', async () => {
    const exercisesService = {
      getBodyParts: jest.fn().mockResolvedValue([
        { id: 'chest', name: '가슴' },
        { id: 'back', name: '등' }
      ]),
      createBodyPart: jest.fn()
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
});
