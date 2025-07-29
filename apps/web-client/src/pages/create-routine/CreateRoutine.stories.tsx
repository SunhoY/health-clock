import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { CreateRoutine } from './CreateRoutine';

const meta: Meta<typeof CreateRoutine> = {
  title: 'Pages/CreateRoutine/CreateRoutine',
  component: CreateRoutine,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}; 