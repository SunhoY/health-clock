import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkoutComplete } from './WorkoutComplete';
import { WorkoutCompletionData, UserStatistics } from '../../types/exercise';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock console.log
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

  it('사용자 통계가 없을 때 기본값으로 통계를 업데이트한다', () => {
    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} />
      </MemoryRouter>
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('사용자 통계 업데이트:', {
      totalWorkouts: 1,
      totalDuration: 45,
      currentStreak: 1,
    });
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

  it('추가 운동하기 버튼 클릭 시 preset-selection 페이지로 이동한다', () => {
    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '추가 운동하기' }));
    expect(mockNavigate).toHaveBeenCalledWith('/preset-selection');
  });

  it('홈으로 돌아가기 버튼 클릭 시 홈 페이지로 이동한다', () => {
    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '홈으로 돌아가기' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('첫 운동 완료 시 성취 배지를 표시한다', () => {
    const firstWorkoutStats: UserStatistics = {
      currentStreak: 1,
      totalWorkouts: 1,
      totalDuration: 45,
    };

    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} userStats={firstWorkoutStats} />
      </MemoryRouter>
    );

    expect(screen.getByText('첫 운동 완료')).toBeInTheDocument();
    expect(screen.getByText('첫 번째 운동을 완료했습니다!')).toBeInTheDocument();
  });

  it('7일 연속 운동 달성 시 성취 배지를 표시한다', () => {
    const streakStats: UserStatistics = {
      currentStreak: 7,
      totalWorkouts: 10,
      totalDuration: 300,
    };

    render(
      <MemoryRouter>
        <WorkoutComplete completionData={mockCompletionData} userStats={streakStats} />
      </MemoryRouter>
    );

    expect(screen.getByText('7일 연속 운동')).toBeInTheDocument();
    expect(screen.getByText('일주일 연속으로 운동을 완료했습니다!')).toBeInTheDocument();
  });

  it('1시간 이상 운동 시 장시간 운동 성취 배지를 표시한다', () => {
    const longWorkoutData: WorkoutCompletionData = {
      ...mockCompletionData,
      duration: 75, // 1시간 15분
    };

    render(
      <MemoryRouter>
        <WorkoutComplete completionData={longWorkoutData} />
      </MemoryRouter>
    );

    expect(screen.getByText('장시간 운동')).toBeInTheDocument();
    expect(screen.getByText('1시간 이상 운동을 완료했습니다!')).toBeInTheDocument();
  });

  it('500kg 이상 중량 운동 시 고중량 운동 성취 배지를 표시한다', () => {
    const heavyWorkoutData: WorkoutCompletionData = {
      ...mockCompletionData,
      totalWeight: 600,
    };

    render(
      <MemoryRouter>
        <WorkoutComplete completionData={heavyWorkoutData} />
      </MemoryRouter>
    );

    expect(screen.getByText('고중량 운동')).toBeInTheDocument();
    expect(screen.getByText('총 500kg 이상을 들어올렸습니다!')).toBeInTheDocument();
  });

  it('유산소 운동에 적합한 축하 메시지를 표시한다', () => {
    const cardioWorkoutData: WorkoutCompletionData = {
      ...mockCompletionData,
      exercises: [
        {
          exerciseId: 'ex-1',
          exerciseName: '러닝',
          bodyPart: 'cardio',
          sets: [
            { setNumber: 1, exerciseId: 'ex-1', duration: 1800, completed: true },
          ],
        },
      ],
    };

    render(
      <MemoryRouter>
        <WorkoutComplete completionData={cardioWorkoutData} />
      </MemoryRouter>
    );

    // 유산소 운동 메시지 중 하나가 표시되는지 확인
    const cardioMessages = ['심폐지구력이 향상되고 있어요!', '하루 한 걸음, 멋진 당신의 루틴!'];
    const displayedMessage = screen.getByText(/심폐지구력|하루 한 걸음/);
    expect(cardioMessages).toContain(displayedMessage.textContent || '');
  });

  it('근력 운동에 적합한 축하 메시지를 표시한다', () => {
    const strengthWorkoutData: WorkoutCompletionData = {
      ...mockCompletionData,
      exercises: [
        {
          exerciseId: 'ex-1',
          exerciseName: '스쿼트',
          bodyPart: 'legs',
          sets: [
            { setNumber: 1, exerciseId: 'ex-1', weight: 50, reps: 10, completed: true },
          ],
          totalWeight: 50,
        },
      ],
    };

    render(
      <MemoryRouter>
        <WorkoutComplete completionData={strengthWorkoutData} />
      </MemoryRouter>
    );

    // 근력 운동 메시지 중 하나가 표시되는지 확인
    const strengthMessages = ['근육이 자라고 있어요!', '와! 오늘도 완벽하게 해냈어요'];
    const displayedMessage = screen.getByText(/근육이 자라고|오늘도 완벽하게/);
    expect(strengthMessages).toContain(displayedMessage.textContent || '');
  });
}); 