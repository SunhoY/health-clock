import type { Meta, StoryObj } from '@storybook/react';
import { HomeView } from './HomeView';

const meta: Meta<typeof HomeView> = {
  title: 'Pages/Home/HomeView',
  component: HomeView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onStartWorkout: { action: 'start workout clicked' },
    onStartGoogleLogin: { action: 'google login clicked' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
}; 
