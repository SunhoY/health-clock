import type { Meta, StoryObj } from '@storybook/react';
import { ExerciseSelectionView } from './ExerciseSelectionView';
import { EXERCISES_DATA } from '../../types/exercise';

const meta: Meta<typeof ExerciseSelectionView> = {
  title: 'Pages/ExerciseSelection/ExerciseSelectionView',
  component: ExerciseSelectionView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedBodyPart: 'chest',
    exercises: EXERCISES_DATA.chest,
    onExerciseSelect: (exercise) => console.log('Selected exercise:', exercise),
  },
};

export const BackExercises: Story = {
  args: {
    selectedBodyPart: 'back',
    exercises: EXERCISES_DATA.back,
    onExerciseSelect: (exercise) => console.log('Selected exercise:', exercise),
  },
};

export const CardioExercises: Story = {
  args: {
    selectedBodyPart: 'cardio',
    exercises: EXERCISES_DATA.cardio,
    onExerciseSelect: (exercise) => console.log('Selected exercise:', exercise),
  },
};

export const EmptyState: Story = {
  args: {
    selectedBodyPart: 'unknown',
    exercises: [],
    onExerciseSelect: (exercise) => console.log('Selected exercise:', exercise),
  },
}; 