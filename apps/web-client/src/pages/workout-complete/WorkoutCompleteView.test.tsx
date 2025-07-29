import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutCompleteView } from './WorkoutCompleteView';
import { WorkoutCompletionData, CelebrationMessage, Achievement } from '../../types/exercise';

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
        { setNumber: 2, exerciseId: 'ex-2', weight: 40, reps: 8, completed: true },
      ],
      totalWeight: 80,
    },
  ],
  totalSets: 4,
  totalWeight: 180,
  caloriesBurned: 250,
};

const mockCelebrationMessage: CelebrationMessage = {
  id: '1',
  message: '와! 오늘도 완벽하게 해냈어요',
  emoji: '💪',
  category: 'general',
};

const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: '첫 운동 완료',
    description: '첫 번째 운동을 완료했습니다!',
    icon: '🎯',
    unlockedAt: new Date(),
    category: 'frequency',
  },
];

const mockHandlers = {
  onViewSummary: jest.fn(),
  onStartNewWorkout: jest.fn(),
  onGoHome: jest.fn(),
};

describe('WorkoutCompleteView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('축하 메시지와 이모지가 표시된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('와! 오늘도 완벽하게 해냈어요')).toBeInTheDocument();
    expect(screen.getByText('💪')).toBeInTheDocument();
  });

  it('운동 요약 정보가 올바르게 표시된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('45분')).toBeInTheDocument();
    expect(screen.getByText('4세트')).toBeInTheDocument();
    expect(screen.getByText('180kg')).toBeInTheDocument();
    expect(screen.getByText('250kcal')).toBeInTheDocument();
  });

  it('완료한 운동 목록이 표시된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('스쿼트')).toBeInTheDocument();
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getAllByText('2세트')).toHaveLength(2);
  });

  it('성취 배지가 있을 때 배지 섹션이 표시된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        achievements={mockAchievements}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('🏆 새로운 성취!')).toBeInTheDocument();
    expect(screen.getByText('첫 운동 완료')).toBeInTheDocument();
    expect(screen.getByText('첫 번째 운동을 완료했습니다!')).toBeInTheDocument();
  });

  it('성취 배지가 없을 때 배지 섹션이 표시되지 않는다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    expect(screen.queryByText('🏆 새로운 성취!')).not.toBeInTheDocument();
  });

  it('액션 버튼들이 올바르게 렌더링된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    expect(screen.getByRole('button', { name: '상세 요약 보기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가 운동하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '홈으로 돌아가기' })).toBeInTheDocument();
  });

  it('상세 요약 보기 버튼 클릭 시 핸들러가 호출된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '상세 요약 보기' }));
    expect(mockHandlers.onViewSummary).toHaveBeenCalledTimes(1);
  });

  it('추가 운동하기 버튼 클릭 시 핸들러가 호출된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '추가 운동하기' }));
    expect(mockHandlers.onStartNewWorkout).toHaveBeenCalledTimes(1);
  });

  it('홈으로 돌아가기 버튼 클릭 시 핸들러가 호출된다', () => {
    render(
      <WorkoutCompleteView
        completionData={mockCompletionData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '홈으로 돌아가기' }));
    expect(mockHandlers.onGoHome).toHaveBeenCalledTimes(1);
  });

  it('1시간 이상의 운동 시간이 올바르게 포맷된다', () => {
    const longWorkoutData = {
      ...mockCompletionData,
      duration: 90, // 1시간 30분
    };

    render(
      <WorkoutCompleteView
        completionData={longWorkoutData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('1시간 30분')).toBeInTheDocument();
  });

  it('중량이 없는 경우 총 중량 섹션이 표시되지 않는다', () => {
    const noWeightData = {
      ...mockCompletionData,
      totalWeight: undefined,
    };

    render(
      <WorkoutCompleteView
        completionData={noWeightData}
        celebrationMessage={mockCelebrationMessage}
        {...mockHandlers}
      />
    );

    expect(screen.queryByText('총 중량')).not.toBeInTheDocument();
  });
}); 