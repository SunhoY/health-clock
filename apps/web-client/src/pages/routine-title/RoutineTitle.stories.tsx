import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { RoutineTitle } from './RoutineTitle';

const meta: Meta<typeof RoutineTitle> = {
  title: 'Pages/RoutineTitle/RoutineTitle',
  component: RoutineTitle,
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