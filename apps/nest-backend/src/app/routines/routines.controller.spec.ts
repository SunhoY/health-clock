import { RoutinesController } from './routines.controller';
import { RoutinesService } from './routines.service';

describe('RoutinesController', () => {
  it('should request routine summaries by current user id', async () => {
    const routinesService = {
      getRoutineSummariesByUserId: jest.fn().mockResolvedValue([
        {
          id: 'routine-1',
          title: '상체 루틴',
          exerciseCount: 4,
          createdAt: '2026-02-17T10:00:00.000Z',
          lastUsedAt: null
        }
      ])
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
        createdAt: '2026-02-17T10:00:00.000Z',
        lastUsedAt: null
      }
    ]);
  });
});
