import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkoutComplete } from './WorkoutComplete';
import { WorkoutCompletionData, UserStatistics } from '../../types/exercise';

const mockNavigate = jest.fn();
let mockLocationState: unknown = undefined;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: mockLocationState,
    pathname: '/workout-complete',
    search: '',
    hash: '',
  }),
}));

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => undefined);

const mockCompletionData: WorkoutCompletionData = {
  sessionId: 'session-1',
  completedAt: new Date('2024-01-01T10:00:00Z'),
  duration: 45,
  exercises: [
    {
      exerciseId: 'ex-1',
      exerciseName: '스쿼트',
      bodyPart: 'legs',
      sets: [
        { setNumber: 1, exerciseId: 'ex-1', weight: 50, reps: 10, completed: true },
        { setNumber: 2, exerciseId: 'ex-1', weight: 50, reps: 10, completed: true },
      ],
      totalWeight: 100,
    },
  ],
  totalSets: 2,
  totalWeight: 100,
  caloriesBurned: 200,
};

const mockUserStats: UserStatistics = {
  currentStreak: 3,
  totalWorkouts: 5,
  totalDuration: 180,
};

describe('WorkoutComplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationState = undefined;
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('운동 완료 데이터 저장 시 콘솔에 로그를 출력한다', () => {
    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} />
      </MemoryRouter>
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('운동 완료 데이터 저장:', mockCompletionData);
  });

  it('사용자 통계 업데이트 시 콘솔에 로그를 출력한다', () => {
    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} userStats={mockUserStats} />
      </MemoryRouter>
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('사용자 통계 업데이트:', {
      totalWorkouts: 6,
      totalDuration: 225,
      currentStreak: 3,
    });
  });

  it('completionData가 없을 때 홈으로 리다이렉트한다', () => {
    render(
      <MemoryRouter>
        <WorkoutComplete />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('location state의 completionData를 사용해 화면을 렌더링한다', () => {
    mockLocationState = { completionData: mockCompletionData };

    render(
      <MemoryRouter>
        <WorkoutComplete />
      </MemoryRouter>
    );

    expect(screen.getByTestId('workout-duration')).toHaveTextContent('45분');
    expect(screen.getByTestId('completed-exercises')).toHaveTextContent('스쿼트');
  });

  it('상세 요약 보기 버튼 클릭 시 workout-summary 페이지로 이동한다', () => {
    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '상세 요약 보기' }));
    expect(mockNavigate).toHaveBeenCalledWith('/workout-summary', {
      state: { completionData: mockCompletionData },
    });
  });

  it('운동 마치기 버튼 클릭 시 홈으로 이동한다', () => {
    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '운동 마치기' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
