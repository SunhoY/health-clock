import type { Meta, StoryObj } from '@storybook/react';
import { WorkoutView } from './WorkoutView';
import { WorkoutProgress, TimerState } from '../../types/exercise';

const meta: Meta<typeof WorkoutView> = {
  title: 'Pages/Workout/WorkoutView',
  component: WorkoutView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockOnCompleteSet = () => console.log('세트 완료');
const mockOnSkipRest = () => console.log('휴식 건너뛰기');
const mockOnPauseWorkout = () => console.log('운동 일시정지');
const mockOnResumeWorkout = () => console.log('운동 재개');
const mockOnAbandonWorkout = () => console.log('운동 중단');

const baseProgress: WorkoutProgress = {
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

const baseTimerState: TimerState = {
  isRunning: false,
  timeRemaining: 60,
  totalTime: 60,
  isPaused: false
};

export const ActiveSet: Story = {
  args: {
    progress: baseProgress,
    timerState: baseTimerState,
    isResting: false,
    onCompleteSet: mockOnCompleteSet,
    onSkipRest: mockOnSkipRest,
    onPauseWorkout: mockOnPauseWorkout,
    onResumeWorkout: mockOnResumeWorkout,
    onAbandonWorkout: mockOnAbandonWorkout,
  },
};

export const RestPeriod: Story = {
  args: {
    progress: baseProgress,
    timerState: baseTimerState,
    isResting: true,
    onCompleteSet: mockOnCompleteSet,
    onSkipRest: mockOnSkipRest,
    onPauseWorkout: mockOnPauseWorkout,
    onResumeWorkout: mockOnResumeWorkout,
    onAbandonWorkout: mockOnAbandonWorkout,
  },
};

export const FirstSet: Story = {
  args: {
    progress: {
      ...baseProgress,
      currentSet: 1,
      percentComplete: 0
    },
    timerState: baseTimerState,
    isResting: false,
    onCompleteSet: mockOnCompleteSet,
    onSkipRest: mockOnSkipRest,
    onPauseWorkout: mockOnPauseWorkout,
    onResumeWorkout: mockOnResumeWorkout,
    onAbandonWorkout: mockOnAbandonWorkout,
  },
};

export const LastSet: Story = {
  args: {
    progress: {
      ...baseProgress,
      currentSet: 3,
      totalSets: 3,
      percentComplete: 66.67
    },
    timerState: baseTimerState,
    isResting: false,
    onCompleteSet: mockOnCompleteSet,
    onSkipRest: mockOnSkipRest,
    onPauseWorkout: mockOnPauseWorkout,
    onResumeWorkout: mockOnResumeWorkout,
    onAbandonWorkout: mockOnAbandonWorkout,
  },
};

export const WeightExercise: Story = {
  args: {
    progress: baseProgress,
    timerState: baseTimerState,
    isResting: false,
    onCompleteSet: mockOnCompleteSet,
    onSkipRest: mockOnSkipRest,
    onPauseWorkout: mockOnPauseWorkout,
    onResumeWorkout: mockOnResumeWorkout,
    onAbandonWorkout: mockOnAbandonWorkout,
  },
};

export const CardioExercise: Story = {
  args: {
    progress: {
      ...baseProgress,
      currentExercise: {
        exerciseId: 'running',
        exerciseName: '러닝',
        bodyPart: 'cardio',
        sets: 1,
        duration: 30
      }
    },
    timerState: baseTimerState,
    isResting: false,
    onCompleteSet: mockOnCompleteSet,
    onSkipRest: mockOnSkipRest,
    onPauseWorkout: mockOnPauseWorkout,
    onResumeWorkout: mockOnResumeWorkout,
    onAbandonWorkout: mockOnAbandonWorkout,
  },
};

export const PausedWorkout: Story = {
  args: {
    progress: baseProgress,
    timerState: {
      ...baseTimerState,
      isPaused: true
    },
    isResting: false,
    onCompleteSet: mockOnCompleteSet,
    onSkipRest: mockOnSkipRest,
    onPauseWorkout: mockOnPauseWorkout,
    onResumeWorkout: mockOnResumeWorkout,
    onAbandonWorkout: mockOnAbandonWorkout,
  },
}; 