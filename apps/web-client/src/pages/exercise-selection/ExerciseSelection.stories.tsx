import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { ExerciseSelection } from './ExerciseSelection';

const meta: Meta<typeof ExerciseSelection> = {
  title: 'Pages/ExerciseSelection/ExerciseSelection',
  component: ExerciseSelection,
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