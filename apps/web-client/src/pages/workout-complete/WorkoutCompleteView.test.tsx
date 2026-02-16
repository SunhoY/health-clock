import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutCompleteView } from './WorkoutCompleteView';
import { WorkoutCompletionData } from '../../types/exercise';

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
    {
      exerciseId: 'ex-2',
      exerciseName: '벤치프레스',
      bodyPart: 'chest',
      sets: [
        { setNumber: 1, exerciseId: 'ex-2', weight: 40, reps: 8, completed: true },
      ],
      totalWeight: 40,
    },
  ],
  totalSets: 3,
  totalWeight: 140,
  caloriesBurned: 250,
};

const mockHandlers = {
  onViewSummary: jest.fn(),
  onFinishWorkout: jest.fn(),
};

describe('WorkoutCompleteView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('운동 시간과 완료한 운동 목록이 표시된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('workout-duration')).toHaveTextContent('45분');
    expect(screen.getByTestId('completed-exercises')).toHaveTextContent('스쿼트');
    expect(screen.getByTestId('completed-exercises')).toHaveTextContent('벤치프레스');
  });

  it('총중량/총세트/칼로리 요약값은 표시하지 않는다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        {...mockHandlers}
      />
    );

    expect(screen.queryByText('140kg')).not.toBeInTheDocument();
    expect(screen.queryByText('3세트')).not.toBeInTheDocument();
    expect(screen.queryByText('250kcal')).not.toBeInTheDocument();
  });

  it('운동 마치기 버튼 클릭 시 핸들러가 호출된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '운동 마치기' }));
    expect(mockHandlers.onFinishWorkout).toHaveBeenCalledTimes(1);
  });

  it('상세 요약 보기 버튼 클릭 시 핸들러가 호출된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '상세 요약 보기' }));
    expect(mockHandlers.onViewSummary).toHaveBeenCalledTimes(1);
  });

  it('1시간 이상 운동 시간이 올바르게 포맷된다', () => {
    const longWorkoutData = {
      ...mockCompletionData,
      duration: 90,
    };

    render(
      <WorkoutCompleteView
        completionData={longWorkoutData}
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('workout-duration')).toHaveTextContent('1시간 30분');
  });
});
