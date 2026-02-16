import type { Meta, StoryObj } from '@storybook/react';
import { ExerciseDetailView } from './ExerciseDetailView';
import { Exercise } from '../../types/exercise';

const meta: Meta<typeof ExerciseDetailView> = {
  title: 'Pages/ExerciseDetail/ExerciseDetailView',
  component: ExerciseDetailView,
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    onSetCountChange: { action: 'set count changed' },
    onStrengthSetChange: { action: 'strength set changed' },
    onStrengthSetStepChange: { action: 'strength set step changed' },
    onDurationInputChange: { action: 'duration changed' },
    onAddExercise: { action: 'add exercise clicked' },
    onCompleteRoutine: { action: 'complete routine clicked' }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

const weightExercise: Exercise = {
  id: 'bench-press',
  name: '벤치프레스',
  bodyPart: 'chest'
};

const cardioExercise: Exercise = {
  id: 'treadmill',
  name: '러닝머신',
  bodyPart: 'cardio'
};

const baseArgs = {
  setCount: 3,
  setRange: { min: 1, max: 10, step: 1, default: 3 },
  strengthSets: [
    { setNumber: 1, weightInput: '20', repsInput: '10', weightTouched: true, repsTouched: true },
    { setNumber: 2, weightInput: '25', repsInput: '8', weightTouched: true, repsTouched: true },
    { setNumber: 3, weightInput: '25', repsInput: '8', weightTouched: true, repsTouched: true }
  ],
  strengthErrors: {},
  durationInput: '30',
  durationError: undefined,
  isFormValid: true
};

export const Strength: Story = {
  args: {
    ...baseArgs,
    exercise: weightExercise,
    isCardio: false
  }
};

export const Cardio: Story = {
  args: {
    ...baseArgs,
    exercise: cardioExercise,
    isCardio: true
  }
};

export const InvalidStrength: Story = {
  args: {
    ...baseArgs,
    exercise: weightExercise,
    isCardio: false,
    isFormValid: false,
    strengthErrors: {
      1: { weight: '중량을 입력해주세요.', reps: '횟수를 입력해주세요.' }
    }
  }
};
