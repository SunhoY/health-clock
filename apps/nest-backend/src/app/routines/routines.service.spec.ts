import { RoutinesRepository } from './routines.repository';
import { RoutinesService } from './routines.service';

describe('RoutinesService', () => {
  it('should delete the routine for the authenticated user', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn(),
      deleteByRoutineIdAndUserId: jest.fn().mockResolvedValue(true)
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);
    await service.deleteRoutineByUserId('routine-1', 'user-1');

    expect(routinesRepository.deleteByRoutineIdAndUserId).toHaveBeenCalledWith(
      'routine-1',
      'user-1'
    );
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
      deleteByRoutineIdAndUserId: jest.fn()
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
