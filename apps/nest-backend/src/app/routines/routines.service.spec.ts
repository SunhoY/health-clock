import { RoutinesRepository } from './routines.repository';
import { RoutinesService } from './routines.service';

describe('RoutinesService', () => {
  it('should return mapped routine summaries for the authenticated user', async () => {
    const routinesRepository = {
      findSummariesByUserId: jest.fn().mockResolvedValue([
        {
          id: 'routine-1',
          title: '상체 루틴',
          exerciseCount: 4,
          createdAt: new Date('2026-02-17T10:00:00.000Z'),
          lastUsedAt: new Date('2026-02-16T18:10:00.000Z')
        }
      ])
    } as unknown as RoutinesRepository;

    const service = new RoutinesService(routinesRepository);
    const result = await service.getRoutineSummariesByUserId('user-1');

    expect(routinesRepository.findSummariesByUserId).toHaveBeenCalledWith('user-1');
    expect(result).toEqual([
      {
        id: 'routine-1',
        title: '상체 루틴',
        exerciseCount: 4,
        createdAt: '2026-02-17T10:00:00.000Z',
        lastUsedAt: '2026-02-16T18:10:00.000Z'
      }
    ]);
  });
});
