import type { Meta, StoryObj } from '@storybook/react';
import { WorkoutView } from './WorkoutView';
import { TimerState, WorkoutViewModel } from '../../types/exercise';

const meta: Meta<typeof WorkoutView> = {
  title: 'Pages/Workout/WorkoutView',
  component: WorkoutView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onCompleteSet: { action: 'complete set clicked' },
    onSkipRest: { action: 'skip rest clicked' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseViewModel: WorkoutViewModel = {
  exerciseName: '벤치프레스',
  currentExerciseIndex: 0,
  totalExercises: 1,
  currentSet: 1,
  totalSets: 3,
  percentComplete: 33.33,
  weight: 20,
  reps: 10,
};

const baseTimerState: TimerState = {
  isRunning: false,
  timeRemaining: 60,
  totalTime: 60,
  isPaused: false,
};

export const ActiveSet: Story = {
  args: {
    viewModel: baseViewModel,
    timerState: baseTimerState,
    isResting: false,
  },
};

export const RestPeriod: Story = {
  args: {
    viewModel: {
      ...baseViewModel,
      currentSet: 2,
      previousSetLabel: '이전 1 / 3 세트',
      previousWeight: 20,
      previousReps: 10,
      nextSetLabel: '다음 2 / 3 세트',
      nextWeight: 20,
      nextReps: 10,
    },
    timerState: baseTimerState,
    isResting: true,
  },
};

export const FirstSet: Story = {
  args: {
    viewModel: {
      ...baseViewModel,
      currentSet: 1,
      percentComplete: 0,
    },
    timerState: baseTimerState,
    isResting: false,
  },
};

export const LastSet: Story = {
  args: {
    viewModel: {
      ...baseViewModel,
      currentSet: 3,
      totalSets: 3,
      percentComplete: 66.67,
    },
    timerState: baseTimerState,
    isResting: false,
  },
};

export const CardioExercise: Story = {
  args: {
    viewModel: {
      ...baseViewModel,
      exerciseName: '러닝',
      weight: undefined,
      reps: undefined,
      duration: 30,
    },
    timerState: baseTimerState,
    isResting: false,
  },
};
