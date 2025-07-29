import type { Meta, StoryObj } from '@storybook/react';
import { ExerciseDetailView } from './ExerciseDetailView';
import { Exercise, FormState, FormConfig } from '../../types/exercise';

const meta: Meta<typeof ExerciseDetailView> = {
  title: 'Pages/ExerciseDetail/ExerciseDetailView',
  component: ExerciseDetailView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockFormConfig: FormConfig = {
  sets: { min: 1, max: 10, step: 1, default: 3 },
  weight: { min: 0, max: 500, step: 5, default: 20 },
  duration: { min: 1, max: 180, step: 1, default: 30 }
};

const mockFormState: FormState = {
  sets: 3,
  weight: 20,
  duration: 30,
  isValid: true,
  errors: {}
};

const mockWeightExercise: Exercise = {
  id: 'bench-press',
  name: '벤치프레스',
  bodyPart: 'chest',
  equipment: ['바벨', '벤치'],
  difficulty: 'intermediate'
};

const mockCardioExercise: Exercise = {
  id: 'treadmill',
  name: '러닝머신',
  bodyPart: 'cardio',
  equipment: ['러닝머신']
};

export const WeightExercise: Story = {
  args: {
    exercise: mockWeightExercise,
    formState: mockFormState,
    formConfig: mockFormConfig,
    isCardio: false,
    onSetsChange: (sets: number) => console.log('Sets changed:', sets),
    onWeightChange: (weight: number) => console.log('Weight changed:', weight),
    onDurationChange: (duration: number) => console.log('Duration changed:', duration),
    onAddExercise: () => console.log('Add exercise clicked'),
    onCompleteRoutine: () => console.log('Complete routine clicked'),
  },
};

export const CardioExercise: Story = {
  args: {
    exercise: mockCardioExercise,
    formState: mockFormState,
    formConfig: mockFormConfig,
    isCardio: true,
    onSetsChange: (sets: number) => console.log('Sets changed:', sets),
    onWeightChange: (weight: number) => console.log('Weight changed:', weight),
    onDurationChange: (duration: number) => console.log('Duration changed:', duration),
    onAddExercise: () => console.log('Add exercise clicked'),
    onCompleteRoutine: () => console.log('Complete routine clicked'),
  },
};

export const WithErrors: Story = {
  args: {
    exercise: mockWeightExercise,
    formState: {
      ...mockFormState,
      isValid: false,
      errors: {
        sets: '세트 수는 1개 이상이어야 합니다.',
        weight: '중량은 0kg 이상이어야 합니다.'
      }
    },
    formConfig: mockFormConfig,
    isCardio: false,
    onSetsChange: (sets: number) => console.log('Sets changed:', sets),
    onWeightChange: (weight: number) => console.log('Weight changed:', weight),
    onDurationChange: (duration: number) => console.log('Duration changed:', duration),
    onAddExercise: () => console.log('Add exercise clicked'),
    onCompleteRoutine: () => console.log('Complete routine clicked'),
  },
}; 