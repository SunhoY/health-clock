import type { Meta, StoryObj } from '@storybook/react';
import { WorkoutCompleteView } from './WorkoutCompleteView';
import { WorkoutCompletionData, CelebrationMessage, Achievement } from '../../types/exercise';

const meta: Meta<typeof WorkoutCompleteView> = {
  title: 'Pages/WorkoutComplete/WorkoutCompleteView',
  component: WorkoutCompleteView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onViewSummary: { action: 'view summary clicked' },
    onStartNewWorkout: { action: 'start new workout clicked' },
    onGoHome: { action: 'go home clicked' },
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
        { setNumber: 2, exerciseId: 'ex-2', weight: 40, reps: 8, completed: true },
      ],
      totalWeight: 80,
    },
  ],
  totalSets: 4,
  totalWeight: 180,
  caloriesBurned: 250,
};

const baseCelebrationMessage: CelebrationMessage = {
  id: '1',
  message: '와! 오늘도 완벽하게 해냈어요',
  emoji: '💪',
  category: 'general',
};

const baseAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: '첫 운동 완료',
    description: '첫 번째 운동을 완료했습니다!',
    icon: '🎯',
    unlockedAt: new Date(),
    category: 'frequency',
  },
];

export const StrengthWorkout: Story = {
  args: {
    completionData: baseCompletionData,
    celebrationMessage: baseCelebrationMessage,
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
    },
    celebrationMessage: {
      id: '2',
      message: '하루 한 걸음, 멋진 당신의 루틴!',
      emoji: '🏃‍♂️',
      category: 'cardio',
    },
  },
};

export const MixedWorkout: Story = {
  args: {
    completionData: {
      ...baseCompletionData,
      exercises: [
        ...baseCompletionData.exercises,
        {
          exerciseId: 'ex-3',
          exerciseName: '조깅',
          bodyPart: 'cardio',
          sets: [
            { setNumber: 1, exerciseId: 'ex-3', duration: 1200, completed: true }, // 20분
          ],
          totalDuration: 1200,
        },
      ],
      totalCardioTime: 20,
      duration: 65,
    },
    celebrationMessage: {
      id: '3',
      message: '대단해요! 자신과의 약속을 지켰어요.',
      emoji: '🎉',
      category: 'general',
    },
  },
};

export const WithAchievement: Story = {
  args: {
    completionData: baseCompletionData,
    celebrationMessage: baseCelebrationMessage,
    achievements: baseAchievements,
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
    celebrationMessage: {
      id: '4',
      message: '첫 걸음을 내딛었어요! 멋져요!',
      emoji: '🌟',
      category: 'general',
    },
    achievements: [
      {
        id: 'ach-1',
        title: '첫 운동 완료',
        description: '첫 번째 운동을 완료했습니다!',
        icon: '🎯',
        unlockedAt: new Date(),
        category: 'frequency',
      },
    ],
  },
};

export const StreakAchievement: Story = {
  args: {
    completionData: baseCompletionData,
    celebrationMessage: {
      id: '5',
      message: '7일 연속 운동! 당신은 정말 대단해요!',
      emoji: '🔥',
      category: 'consistency',
    },
    achievements: [
      {
        id: 'ach-2',
        title: '7일 연속 운동',
        description: '일주일 연속으로 운동을 완료했습니다!',
        icon: '🔥',
        unlockedAt: new Date(),
        category: 'streak',
      },
      {
        id: 'ach-3',
        title: '운동 습관 형성',
        description: '규칙적인 운동 습관을 만들고 있습니다!',
        icon: '💪',
        unlockedAt: new Date(),
        category: 'frequency',
      },
    ],
  },
};

export const LongWorkout: Story = {
  args: {
    completionData: {
      ...baseCompletionData,
      duration: 120, // 2시간
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
        {
          exerciseId: 'ex-4',
          exerciseName: '오버헤드 프레스',
          bodyPart: 'shoulders',
          sets: [
            { setNumber: 1, exerciseId: 'ex-4', weight: 30, reps: 8, completed: true },
            { setNumber: 2, exerciseId: 'ex-4', weight: 30, reps: 8, completed: true },
          ],
          totalWeight: 60,
        },
      ],
      totalSets: 9,
      totalWeight: 480,
      caloriesBurned: 450,
    },
    celebrationMessage: {
      id: '6',
      message: '2시간 운동! 정말 대단한 인내심이에요!',
      emoji: '🏋️‍♂️',
      category: 'strength',
    },
  },
}; 