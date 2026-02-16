import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkoutView } from './WorkoutView';
import { TimerState, WorkoutViewModel } from '../../types/exercise';

const mockViewModel: WorkoutViewModel = {
  exerciseName: '벤치프레스',
  currentExerciseIndex: 0,
  totalExercises: 2,
  currentSet: 1,
  totalSets: 3,
  percentComplete: 33.33,
  weight: 20,
  reps: 10,
};

const mockTimerState: TimerState = {
  isRunning: false,
  timeRemaining: 60,
  totalTime: 60,
  isPaused: false,
};

const mockOnCompleteSet = jest.fn();
const mockOnSkipRest = jest.fn();
const mockOnStartNextExercise = jest.fn();

describe('WorkoutView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('핵심 운동 정보와 지표가 올바르게 표시된다', () => {
    render(
      <WorkoutView
        viewModel={mockViewModel}
        timerState={mockTimerState}
        isResting={false}
        isBetweenExercises={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    expect(screen.getByText('운동 1 / 2')).toBeInTheDocument();
    expect(screen.getByText('33% 완료')).toBeInTheDocument();
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('1 / 3 세트')).toBeInTheDocument();
    expect(screen.getByText('20kg')).toBeInTheDocument();
    expect(screen.getByText('10회')).toBeInTheDocument();
  });

  it('지표가 undefined이면 해당 지표는 표시되지 않는다', () => {
    const withoutMetrics: WorkoutViewModel = {
      ...mockViewModel,
      weight: undefined,
      reps: undefined,
      duration: undefined,
    };

    render(
      <WorkoutView
        viewModel={withoutMetrics}
        timerState={mockTimerState}
        isResting={false}
        isBetweenExercises={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    expect(screen.queryByText('20kg')).not.toBeInTheDocument();
    expect(screen.queryByText('10회')).not.toBeInTheDocument();
    expect(screen.queryByText('30분')).not.toBeInTheDocument();
  });

  it('세트 진행 중일 때 세트 완료 버튼이 표시된다', () => {
    render(
      <WorkoutView
        viewModel={mockViewModel}
        timerState={mockTimerState}
        isResting={false}
        isBetweenExercises={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    expect(screen.getByText('세트 완료')).toBeInTheDocument();
    expect(screen.queryByText('휴식 시간')).not.toBeInTheDocument();
  });

  it('휴식 중일 때 타이머와 다음 세트 정보가 표시된다', () => {
    const restViewModel: WorkoutViewModel = {
      ...mockViewModel,
      currentSet: 2,
      previousSetLabel: '이전 1 / 3 세트',
      previousWeight: 20,
      previousReps: 10,
      nextSetLabel: '다음 2 / 3 세트',
      nextWeight: 20,
      nextReps: 10,
    };

    render(
      <WorkoutView
        viewModel={restViewModel}
        timerState={mockTimerState}
        isResting={true}
        isBetweenExercises={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    expect(screen.getByText('휴식 시간')).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
    expect(screen.getByText('이전 1 / 3 세트')).toBeInTheDocument();
    expect(screen.getByText('다음 2 / 3 세트')).toBeInTheDocument();
    expect(screen.getAllByText('20kg')).toHaveLength(2);
    expect(screen.getAllByText('10회')).toHaveLength(2);
    expect(screen.getByText('바로 다음 세트')).toBeInTheDocument();
    expect(screen.queryByText('세트 완료')).not.toBeInTheDocument();

    expect(screen.getByText('이전 1 / 3 세트')).toHaveClass('text-slate-500');
    expect(screen.getByText('다음 2 / 3 세트')).toHaveClass('text-emerald-300');
  });

  it('운동 간 전환 화면에서 완료/다음운동/스톱워치/버튼이 표시된다', () => {
    const transitionViewModel: WorkoutViewModel = {
      ...mockViewModel,
      transitionCompletedExerciseName: '푸시업 완료',
      transitionNextExerciseName: '스쿼트',
      transitionNextWeight: 40,
      transitionNextReps: 12,
      transitionElapsedSeconds: 75,
    };

    render(
      <WorkoutView
        viewModel={transitionViewModel}
        timerState={mockTimerState}
        isResting={false}
        isBetweenExercises={true}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    expect(screen.getByText('운동완료')).toBeInTheDocument();
    expect(screen.getByText('푸시업 완료')).toBeInTheDocument();
    expect(screen.getByText('다음 운동')).toBeInTheDocument();
    expect(screen.getByText('스쿼트')).toBeInTheDocument();
    expect(screen.getByText('40kg')).toBeInTheDocument();
    expect(screen.getByText('12회')).toBeInTheDocument();
    expect(screen.getByText('지난 운동이 끝난지')).toBeInTheDocument();
    expect(screen.getByText('01:15')).toBeInTheDocument();
    expect(screen.getByText('다음 운동 시작')).toBeInTheDocument();
    expect(screen.queryByText('세트 완료')).not.toBeInTheDocument();
  });

  it('세트 완료 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutView
        viewModel={mockViewModel}
        timerState={mockTimerState}
        isResting={false}
        isBetweenExercises={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    await user.click(screen.getByText('세트 완료'));

    expect(mockOnCompleteSet).toHaveBeenCalled();
  });

  it('바로 다음 세트 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutView
        viewModel={{ ...mockViewModel, nextSetLabel: '다음 2 / 3 세트' }}
        timerState={mockTimerState}
        isResting={true}
        isBetweenExercises={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    await user.click(screen.getByText('바로 다음 세트'));

    expect(mockOnSkipRest).toHaveBeenCalled();
  });

  it('다음 운동 시작 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutView
        viewModel={{
          ...mockViewModel,
          transitionCompletedExerciseName: '푸시업 완료',
          transitionNextExerciseName: '스쿼트',
          transitionElapsedSeconds: 0,
        }}
        timerState={mockTimerState}
        isResting={false}
        isBetweenExercises={true}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    await user.click(screen.getByText('다음 운동 시작'));

    expect(mockOnStartNextExercise).toHaveBeenCalled();
  });

  it('일시정지와 중단 버튼이 표시되지 않는다', () => {
    render(
      <WorkoutView
        viewModel={mockViewModel}
        timerState={mockTimerState}
        isResting={false}
        isBetweenExercises={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
        onStartNextExercise={mockOnStartNextExercise}
      />
    );

    expect(screen.queryByText('일시정지')).not.toBeInTheDocument();
    expect(screen.queryByText('재개')).not.toBeInTheDocument();
    expect(screen.queryByText('중단')).not.toBeInTheDocument();
  });
});
