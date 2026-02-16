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

describe('WorkoutView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('핵심 운동 정보가 올바르게 표시된다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
      />
    );

    expect(screen.getByText('운동 1 / 1')).toBeInTheDocument();
    expect(screen.getByText('33% 완료')).toBeInTheDocument();
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('1 / 3 세트')).toBeInTheDocument();
  });

  it('세트 진행 중일 때 세트 완료 버튼이 표시된다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
      />
    );

    expect(screen.getByText('세트 완료')).toBeInTheDocument();
    expect(screen.queryByText('휴식 시간')).not.toBeInTheDocument();
  });

  it('휴식 중일 때 타이머와 다음 세트 버튼이 표시된다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={true}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
      />
    );

    expect(screen.getByText('휴식 시간')).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
    expect(screen.getByText('바로 다음 세트')).toBeInTheDocument();
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
      />
    );

    await user.click(screen.getByText('세트 완료'));

    expect(mockOnCompleteSet).toHaveBeenCalled();
  });

  it('바로 다음 세트 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={true}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
      />
    );

    await user.click(screen.getByText('바로 다음 세트'));

    expect(mockOnSkipRest).toHaveBeenCalled();
  });

  it('일시정지와 중단 버튼이 표시되지 않는다', () => {
    render(
      <WorkoutView
        progress={mockProgress}
        timerState={mockTimerState}
        isResting={false}
        onCompleteSet={mockOnCompleteSet}
        onSkipRest={mockOnSkipRest}
      />
    );

    expect(screen.queryByText('일시정지')).not.toBeInTheDocument();
    expect(screen.queryByText('재개')).not.toBeInTheDocument();
    expect(screen.queryByText('중단')).not.toBeInTheDocument();
  });
});
