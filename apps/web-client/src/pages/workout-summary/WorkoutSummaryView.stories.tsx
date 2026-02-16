import type { Meta, StoryObj } from '@storybook/react';
import { WorkoutSummaryView } from './WorkoutSummaryView';
import { WorkoutDetailSummaryViewModel } from '../../types/exercise';

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

const baseViewModel: WorkoutDetailSummaryViewModel = {
  todayBodyParts: ['cardio', 'upper', 'core'],
  sections: [
    { bodyPart: 'cardio', label: '유산소', caloriesBurned: 320 },
    { bodyPart: 'upper', label: '상체', totalSets: 8, maxWeight: 60 },
    { bodyPart: 'core', label: '코어', totalSets: 4, maxWeight: 20 },
  ],
};

export const Mixed: Story = {
  args: {
    viewModel: baseViewModel,
  },
};

export const UpperOnly: Story = {
  args: {
    viewModel: {
      todayBodyParts: ['upper'],
      sections: [{ bodyPart: 'upper', label: '상체', totalSets: 6, maxWeight: 70 }],
    },
  },
};

export const CardioOnly: Story = {
  args: {
    viewModel: {
      todayBodyParts: ['cardio'],
      sections: [{ bodyPart: 'cardio', label: '유산소', caloriesBurned: 280 }],
    },
  },
};
