import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { ExerciseDetail } from './ExerciseDetail';

const meta: Meta<typeof ExerciseDetail> = {
  title: 'Pages/ExerciseDetail/ExerciseDetail',
  component: ExerciseDetail,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}; 