import type { Meta, StoryObj } from '@storybook/react';
import { ExerciseSelectionView } from './ExerciseSelectionView';
import { EXERCISES_DATA } from '../../types/exercise';

const meta: Meta<typeof ExerciseSelectionView> = {
  title: 'Pages/ExerciseSelection/ExerciseSelectionView',
  component: ExerciseSelectionView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onExerciseSelect: { action: 'exercise selected' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedBodyPart: 'chest',
    exercises: EXERCISES_DATA.chest,
  },
};

export const BackExercises: Story = {
  args: {
    selectedBodyPart: 'back',
    exercises: EXERCISES_DATA.back,
  },
};

export const CardioExercises: Story = {
  args: {
    selectedBodyPart: 'cardio',
    exercises: EXERCISES_DATA.cardio,
  },
};

export const EmptyState: Story = {
  args: {
    selectedBodyPart: 'unknown',
    exercises: [],
  },
}; 