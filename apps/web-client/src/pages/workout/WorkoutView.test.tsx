import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutView } from './WorkoutView';
import { WorkoutProgress, TimerState } from '../../types/exercise';

const mockProgress: WorkoutProgress = {
  currentExercise: {
    exerciseId: 'bench-press',
    exerciseName: '벤치프레스',
    bodyPart: 'chest',
    sets: 3,
    weight: 20
  },
  totalExercises: 1,
  currentExerciseIndex: 0,
  currentSet: 1,
  totalSets: 3,
  percentComplete: 33.33
};

const mockTimerState: TimerState = {
  isRunning: false,
  timeRemaining: 60,
  totalTime: 60,
  isPaused: false
};

const mockOnCompleteSet = jest.fn();
const mockOnSkipRest = jest.fn();
const mockOnPauseWorkout = jest.fn();
const mockOnResumeWorkout = jest.fn();
const mockOnAbandonWorkout = jest.fn();

describe('WorkoutView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('운동 정보가 올바르게 표시된다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    expect(screen.getByText('운동 진행')).toBeInTheDocument();
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('chest')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByText('20kg')).toBeInTheDocument();
  });

  it('진행률이 올바르게 표시된다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('세트 진행 중일 때 세트 완료 버튼이 표시된다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    expect(screen.getByText('세트 1 진행 중')).toBeInTheDocument();
    expect(screen.getByText('세트 완료')).toBeInTheDocument();
    expect(screen.queryByText('휴식 시간')).not.toBeInTheDocument();
  });

  it('휴식 중일 때 타이머가 표시된다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={true}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    expect(screen.getByText('휴식 시간')).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
    expect(screen.getByText('휴식 건너뛰기')).toBeInTheDocument();
    expect(screen.queryByText('세트 완료')).not.toBeInTheDocument();
  });

  it('세트 완료 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    const completeButton = screen.getByText('세트 완료');
    await user.click(completeButton);
    
    expect(mockOnCompleteSet).toHaveBeenCalled();
  });

  it('휴식 건너뛰기 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={true}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    const skipButton = screen.getByText('휴식 건너뛰기');
    await user.click(skipButton);
    
    expect(mockOnSkipRest).toHaveBeenCalled();
  });

  it('일시정지 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    const pauseButton = screen.getByText('일시정지');
    await user.click(pauseButton);
    
    expect(mockOnPauseWorkout).toHaveBeenCalled();
  });

  it('일시정지 상태일 때 재개 버튼이 표시된다', () => {
    const pausedTimerState: TimerState = {
      ...mockTimerState,
      isPaused: true
    };
    
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={pausedTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    expect(screen.getByText('재개')).toBeInTheDocument();
    expect(screen.queryByText('일시정지')).not.toBeInTheDocument();
  });

  it('재개 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    const pausedTimerState: TimerState = {
      ...mockTimerState,
      isPaused: true
    };
    
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={pausedTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    const resumeButton = screen.getByText('재개');
    await user.click(resumeButton);
    
    expect(mockOnResumeWorkout).toHaveBeenCalled();
  });

  it('중단 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    const abandonButton = screen.getByText('중단');
    await user.click(abandonButton);
    
    expect(mockOnAbandonWorkout).toHaveBeenCalled();
  });

  it('유산소 운동일 때 시간이 표시된다', () => {
    const cardioProgress: WorkoutProgress = {
      ...mockProgress,
      currentExercise: {
        ...mockProgress.currentExercise,
        bodyPart: 'cardio',
        duration: 30,
        weight: undefined
      }
    };
    
    render(
      <WorkoutView
        progress={cardioProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    expect(screen.getByText('30분')).toBeInTheDocument();
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
  });

  it('다음 운동 정보가 올바르게 표시된다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    expect(screen.getByText('벤치프레스 - 세트 2')).toBeInTheDocument();
  });

  it('마지막 세트일 때 다음 운동 정보가 올바르게 표시된다', () => {
    const lastSetProgress: WorkoutProgress = {
      ...mockProgress,
      currentSet: 3,
      totalSets: 3
    };
    
    render(
      <WorkoutView
        progress={lastSetProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onPauseWorkout={mockOnPauseWorkout}
        onResumeWorkout={mockOnResumeWorkout}
        onAbandonWorkout={mockOnAbandonWorkout}
      />
    );
    
    expect(screen.getByText('모든 운동 완료!')).toBeInTheDocument();
  });
}); 