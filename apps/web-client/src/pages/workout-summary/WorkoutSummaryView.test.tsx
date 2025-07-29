import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutSummaryView } from './WorkoutSummaryView';
import { DailyWorkoutSummary, ExerciseSummary } from '../../types/exercise';

const mockSummary: DailyWorkoutSummary = {
  date: new Date('2024-01-01T10:00:00Z'),
  totalSessions: 2,
  totalDuration: 90,
  totalExercises: 4,
  totalSets: 8,
  totalWeight: 400,
  totalCardioTime: 30,
  estimatedCalories: 450,
  exercises: [
    {
      exerciseId: 'ex-1',
      exerciseName: '스쿼트',
      bodyPart: 'legs',
      type: 'weight',
      totalSets: 3,
      totalWeight: 150,
      avgWeight: 50,
      maxWeight: 60,
      sessions: ['session-1', 'session-2'],
    },
    {
      exerciseId: 'ex-2',
      exerciseName: '벤치프레스',
      bodyPart: 'chest',
      type: 'weight',
      totalSets: 2,
      totalWeight: 120,
      avgWeight: 60,
      maxWeight: 65,
      sessions: ['session-1'],
    },
    {
      exerciseId: 'ex-3',
      exerciseName: '러닝',
      bodyPart: 'cardio',
      type: 'cardio',
      totalSets: 1,
      totalDuration: 20,
      sessions: ['session-2'],
    },
    {
      exerciseId: 'ex-4',
      exerciseName: '자전거',
      bodyPart: 'cardio',
      type: 'cardio',
      totalSets: 1,
      totalDuration: 10,
      sessions: ['session-2'],
    },
  ],
};

const mockHandlers = {
  onGoBack: jest.fn(),
  onGoHome: jest.fn(),
};

describe('WorkoutSummaryView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('날짜가 올바르게 표시된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    expect(screen.getByText(/2024년 1월 1일/)).toBeInTheDocument();
  });

  it('전체 통계 정보가 올바르게 표시된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // 운동 세션
    expect(screen.getByText('1시간 30분')).toBeInTheDocument(); // 총 운동 시간
    expect(screen.getByText('4')).toBeInTheDocument(); // 운동 종류
    expect(screen.getByText('8')).toBeInTheDocument(); // 총 세트
    expect(screen.getByText('400kg')).toBeInTheDocument(); // 총 중량
    expect(screen.getByText('30분')).toBeInTheDocument(); // 유산소 시간
    expect(screen.getByText('450kcal')).toBeInTheDocument(); // 추정 소모 칼로리
  });

  it('웨이트 운동이 올바른 형식으로 표시된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('legs - 스쿼트 - 3세트')).toBeInTheDocument();
    expect(screen.getByText('chest - 벤치프레스 - 2세트')).toBeInTheDocument();
    expect(screen.getByText('총 중량: 150kg')).toBeInTheDocument();
    expect(screen.getByText('총 중량: 120kg')).toBeInTheDocument();
  });

  it('유산소 운동이 올바른 형식으로 표시된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('유산소 - 러닝 - 20분')).toBeInTheDocument();
    expect(screen.getByText('유산소 - 자전거 - 10분')).toBeInTheDocument();
    expect(screen.getByText('총 시간: 20분')).toBeInTheDocument();
    expect(screen.getByText('총 시간: 10분')).toBeInTheDocument();
  });

  it('세션 횟수가 올바르게 표시된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    expect(screen.getAllByText('2회 세션')).toHaveLength(1); // 스쿼트
    expect(screen.getAllByText('1회 세션')).toHaveLength(3); // 나머지 운동들
  });

  it('액션 버튼들이 올바르게 렌더링된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    expect(screen.getByRole('button', { name: '뒤로가기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '홈으로' })).toBeInTheDocument();
  });

  it('뒤로가기 버튼 클릭 시 핸들러가 호출된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '뒤로가기' }));
    expect(mockHandlers.onGoBack).toHaveBeenCalledTimes(1);
  });

  it('홈으로 버튼 클릭 시 핸들러가 호출된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '홈으로' }));
    expect(mockHandlers.onGoHome).toHaveBeenCalledTimes(1);
  });

  it('운동 기록이 없을 때 빈 상태 메시지가 표시된다', () => {
    const emptySummary: DailyWorkoutSummary = {
      date: new Date('2024-01-01T10:00:00Z'),
      totalSessions: 0,
      totalDuration: 0,
      totalExercises: 0,
      totalSets: 0,
      exercises: [],
    };

    render(
      <WorkoutSummaryView
        summary={emptySummary}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('오늘은 운동 기록이 없어요')).toBeInTheDocument();
    expect(screen.getByText('운동을 시작하고 기록을 남겨보세요!')).toBeInTheDocument();
  });

  it('중량이 없는 경우 총 중량 섹션이 표시되지 않는다', () => {
    const noWeightSummary: DailyWorkoutSummary = {
      ...mockSummary,
      totalWeight: undefined,
      exercises: mockSummary.exercises.map((ex: ExerciseSummary) => ({
        ...ex,
        totalWeight: undefined,
        avgWeight: undefined,
        maxWeight: undefined,
      })),
    };

    render(
      <WorkoutSummaryView
        summary={noWeightSummary}
        {...mockHandlers}
      />
    );

    expect(screen.queryByText('총 중량')).not.toBeInTheDocument();
  });

  it('유산소 시간이 없는 경우 유산소 시간 섹션이 표시되지 않는다', () => {
    const noCardioSummary: DailyWorkoutSummary = {
      ...mockSummary,
      totalCardioTime: undefined,
      exercises: mockSummary.exercises.filter((ex: ExerciseSummary) => ex.type === 'weight'),
    };

    render(
      <WorkoutSummaryView
        summary={noCardioSummary}
        {...mockHandlers}
      />
    );

    expect(screen.queryByText('유산소 시간')).not.toBeInTheDocument();
  });

  it('칼로리가 없는 경우 추정 소모 칼로리 섹션이 표시되지 않는다', () => {
    const noCaloriesSummary: DailyWorkoutSummary = {
      ...mockSummary,
      estimatedCalories: undefined,
    };

    render(
      <WorkoutSummaryView
        summary={noCaloriesSummary}
        {...mockHandlers}
      />
    );

    expect(screen.queryByText('추정 소모 칼로리')).not.toBeInTheDocument();
  });

  it('평균 중량이 있을 때 평균 중량이 표시된다', () => {
    render(
      <WorkoutSummaryView
        summary={mockSummary}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('(평균: 50kg)')).toBeInTheDocument();
    expect(screen.getByText('(평균: 60kg)')).toBeInTheDocument();
  });
}); 