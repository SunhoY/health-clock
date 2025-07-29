import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { WorkoutComplete } from './WorkoutComplete';
import { WorkoutCompletionData, UserStatistics } from '../../types/exercise';

const meta: Meta<typeof WorkoutComplete> = {
  title: 'Pages/WorkoutComplete/WorkoutComplete',
  component: WorkoutComplete,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
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
        { setNumber: 2, exerciseId: 'ex-2', weight: 40, reps: 8, completed: true },
      ],
      totalWeight: 80,
    },
  ],
  totalSets: 4,
  totalWeight: 180,
  caloriesBurned: 250,
};

const baseUserStats: UserStatistics = {
  currentStreak: 3,
  totalWorkouts: 5,
  totalDuration: 180,
};

export const Default: Story = {
  args: {
    completionData: baseCompletionData,
    userStats: baseUserStats,
  },
};

export const FirstWorkout: Story = {
  args: {
    completionData: {
      ...baseCompletionData,
      exercises: [
        {
          exerciseId: 'ex-1',
          exerciseName: '푸시업',
          bodyPart: 'chest',
          sets: [
            { setNumber: 1, exerciseId: 'ex-1', reps: 5, completed: true },
            { setNumber: 2, exerciseId: 'ex-1', reps: 5, completed: true },
          ],
        },
      ],
      totalSets: 2,
      totalWeight: undefined,
      caloriesBurned: 50,
    },
    userStats: {
      currentStreak: 1,
      totalWorkouts: 1,
      totalDuration: 45,
    },
  },
};

export const WeekStreak: Story = {
  args: {
    completionData: baseCompletionData,
    userStats: {
      currentStreak: 7,
      totalWorkouts: 10,
      totalDuration: 300,
    },
  },
};

export const LongWorkout: Story = {
  args: {
    completionData: {
      ...baseCompletionData,
      duration: 90, // 1시간 30분
      exercises: [
        ...baseCompletionData.exercises,
        {
          exerciseId: 'ex-3',
          exerciseName: '데드리프트',
          bodyPart: 'back',
          sets: [
            { setNumber: 1, exerciseId: 'ex-3', weight: 80, reps: 5, completed: true },
            { setNumber: 2, exerciseId: 'ex-3', weight: 80, reps: 5, completed: true },
            { setNumber: 3, exerciseId: 'ex-3', weight: 80, reps: 5, completed: true },
          ],
          totalWeight: 240,
        },
      ],
      totalSets: 7,
      totalWeight: 420,
      caloriesBurned: 400,
    },
    userStats: baseUserStats,
  },
};

export const HeavyLifting: Story = {
  args: {
    completionData: {
      ...baseCompletionData,
      exercises: [
        {
          exerciseId: 'ex-1',
          exerciseName: '스쿼트',
          bodyPart: 'legs',
          sets: [
            { setNumber: 1, exerciseId: 'ex-1', weight: 100, reps: 5, completed: true },
            { setNumber: 2, exerciseId: 'ex-1', weight: 100, reps: 5, completed: true },
            { setNumber: 3, exerciseId: 'ex-1', weight: 100, reps: 5, completed: true },
          ],
          totalWeight: 300,
        },
        {
          exerciseId: 'ex-2',
          exerciseName: '데드리프트',
          bodyPart: 'back',
          sets: [
            { setNumber: 1, exerciseId: 'ex-2', weight: 120, reps: 5, completed: true },
            { setNumber: 2, exerciseId: 'ex-2', weight: 120, reps: 5, completed: true },
          ],
          totalWeight: 240,
        },
      ],
      totalSets: 5,
      totalWeight: 540,
      caloriesBurned: 350,
    },
    userStats: baseUserStats,
  },
};

export const CardioWorkout: Story = {
  args: {
    completionData: {
      ...baseCompletionData,
      exercises: [
        {
          exerciseId: 'ex-1',
          exerciseName: '러닝',
          bodyPart: 'cardio',
          sets: [
            { setNumber: 1, exerciseId: 'ex-1', duration: 1800, completed: true }, // 30분
          ],
          totalDuration: 1800,
        },
        {
          exerciseId: 'ex-2',
          exerciseName: '자전거',
          bodyPart: 'cardio',
          sets: [
            { setNumber: 1, exerciseId: 'ex-2', duration: 900, completed: true }, // 15분
          ],
          totalDuration: 900,
        },
      ],
      totalCardioTime: 45,
      totalWeight: undefined,
      caloriesBurned: 300,
    },
    userStats: baseUserStats,
  },
};

export const NoUserStats: Story = {
  args: {
    completionData: baseCompletionData,
  },
}; 