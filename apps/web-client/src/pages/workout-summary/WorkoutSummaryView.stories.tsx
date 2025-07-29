import type { Meta, StoryObj } from '@storybook/react';
import { WorkoutSummaryView } from './WorkoutSummaryView';
import { DailyWorkoutSummary, ExerciseSummary } from '../../types/exercise';

const meta: Meta<typeof WorkoutSummaryView> = {
  title: 'Pages/WorkoutSummary/WorkoutSummaryView',
  component: WorkoutSummaryView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onGoBack: { action: 'go back clicked' },
    onGoHome: { action: 'go home clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const baseSummary: DailyWorkoutSummary = {
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

export const FullDay: Story = {
  args: {
    summary: baseSummary,
  },
};

export const WeightOnly: Story = {
  args: {
    summary: {
      ...baseSummary,
      totalCardioTime: undefined,
      estimatedCalories: 300,
      exercises: baseSummary.exercises.filter((ex: ExerciseSummary) => ex.type === 'weight'),
    },
  },
};

export const CardioOnly: Story = {
  args: {
    summary: {
      ...baseSummary,
      totalWeight: undefined,
      totalCardioTime: 60,
      estimatedCalories: 400,
      exercises: baseSummary.exercises.filter((ex: ExerciseSummary) => ex.type === 'cardio'),
    },
  },
};

export const MixedWorkout: Story = {
  args: {
    summary: {
      ...baseSummary,
      totalSessions: 3,
      totalDuration: 120,
      totalExercises: 6,
      totalSets: 12,
      totalWeight: 600,
      totalCardioTime: 45,
      estimatedCalories: 600,
      exercises: [
        ...baseSummary.exercises,
        {
          exerciseId: 'ex-5',
          exerciseName: '데드리프트',
          bodyPart: 'back',
          type: 'weight',
          totalSets: 3,
          totalWeight: 240,
          avgWeight: 80,
          maxWeight: 90,
          sessions: ['session-3'],
        },
        {
          exerciseId: 'ex-6',
          exerciseName: '조깅',
          bodyPart: 'cardio',
          type: 'cardio',
          totalSets: 1,
          totalDuration: 15,
          sessions: ['session-3'],
        },
      ],
    },
  },
};

export const SingleExercise: Story = {
  args: {
    summary: {
      ...baseSummary,
      totalSessions: 1,
      totalDuration: 30,
      totalExercises: 1,
      totalSets: 3,
      totalWeight: 150,
      totalCardioTime: undefined,
      estimatedCalories: 200,
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
          sessions: ['session-1'],
        },
      ],
    },
  },
};

export const EmptyState: Story = {
  args: {
    summary: {
      date: new Date('2024-01-01T10:00:00Z'),
      totalSessions: 0,
      totalDuration: 0,
      totalExercises: 0,
      totalSets: 0,
      exercises: [],
    },
  },
};

export const LongWorkout: Story = {
  args: {
    summary: {
      ...baseSummary,
      totalSessions: 1,
      totalDuration: 180, // 3시간
      totalExercises: 8,
      totalSets: 20,
      totalWeight: 1200,
      totalCardioTime: 60,
      estimatedCalories: 800,
      exercises: [
        {
          exerciseId: 'ex-1',
          exerciseName: '스쿼트',
          bodyPart: 'legs',
          type: 'weight',
          totalSets: 5,
          totalWeight: 250,
          avgWeight: 50,
          maxWeight: 60,
          sessions: ['session-1'],
        },
        {
          exerciseId: 'ex-2',
          exerciseName: '벤치프레스',
          bodyPart: 'chest',
          type: 'weight',
          totalSets: 4,
          totalWeight: 200,
          avgWeight: 50,
          maxWeight: 55,
          sessions: ['session-1'],
        },
        {
          exerciseId: 'ex-3',
          exerciseName: '데드리프트',
          bodyPart: 'back',
          type: 'weight',
          totalSets: 4,
          totalWeight: 320,
          avgWeight: 80,
          maxWeight: 90,
          sessions: ['session-1'],
        },
        {
          exerciseId: 'ex-4',
          exerciseName: '오버헤드 프레스',
          bodyPart: 'shoulders',
          type: 'weight',
          totalSets: 3,
          totalWeight: 120,
          avgWeight: 40,
          maxWeight: 45,
          sessions: ['session-1'],
        },
        {
          exerciseId: 'ex-5',
          exerciseName: '바벨 로우',
          bodyPart: 'back',
          type: 'weight',
          totalSets: 4,
          totalWeight: 160,
          avgWeight: 40,
          maxWeight: 45,
          sessions: ['session-1'],
        },
        {
          exerciseId: 'ex-6',
          exerciseName: '러닝',
          bodyPart: 'cardio',
          type: 'cardio',
          totalSets: 1,
          totalDuration: 30,
          sessions: ['session-1'],
        },
        {
          exerciseId: 'ex-7',
          exerciseName: '자전거',
          bodyPart: 'cardio',
          type: 'cardio',
          totalSets: 1,
          totalDuration: 20,
          sessions: ['session-1'],
        },
        {
          exerciseId: 'ex-8',
          exerciseName: '스트레칭',
          bodyPart: 'cardio',
          type: 'cardio',
          totalSets: 1,
          totalDuration: 10,
          sessions: ['session-1'],
        },
      ],
    },
  },
}; 