import type { Meta, StoryObj } from '@storybook/react';
import { HomeView } from './HomeView';

const meta: Meta<typeof HomeView> = {
  title: 'Pages/Home/HomeView',
  component: HomeView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onStartWorkout: () => {
      console.log('운동 시작 버튼 클릭됨');
    },
  },
}; 