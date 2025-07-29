import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { WorkoutSummary } from './WorkoutSummary';

const meta: Meta<typeof WorkoutSummary> = {
  title: 'Pages/WorkoutSummary/WorkoutSummary',
  component: WorkoutSummary,
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

export const Default: Story = {
  args: {},
};

export const WithTargetDate: Story = {
  args: {
    targetDate: new Date('2024-01-01T00:00:00Z'),
  },
};

export const Today: Story = {
  args: {
    targetDate: new Date(),
  },
}; 