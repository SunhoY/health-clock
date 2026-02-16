import type { Meta, StoryObj } from '@storybook/react';
import { WorkoutCompleteView } from './WorkoutCompleteView';
import { WorkoutCompletionData } from '../../types/exercise';

const meta: Meta<typeof WorkoutCompleteView> = {
  title: 'Pages/WorkoutComplete/WorkoutCompleteView',
  component: WorkoutCompleteView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onViewSummary: { action: 'view summary clicked' },
    onFinishWorkout: { action: 'finish workout clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseCompletionData: WorkoutCompletionData = {
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

export const Default: Story = {
  args: {
    completionData: baseCompletionData,
  },
};

export const LongWorkout: Story = {
  args: {
    completionData: {
      ...baseCompletionData,
      duration: 95,
    },
  },
};

export const CardioOnly: Story = {
  args: {
    completionData: {
      ...baseCompletionData,
      exercises: [
        {
          exerciseId: 'ex-3',
          exerciseName: '러닝',
          bodyPart: 'cardio',
          sets: [{ setNumber: 1, exerciseId: 'ex-3', duration: 1800, completed: true }],
          totalDuration: 1800,
        },
      ],
      totalWeight: undefined,
      totalSets: 1,
    },
  },
};
