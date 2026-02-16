import type { Meta, StoryObj } from '@storybook/react';
import { RoutineTitleView } from './RoutineTitleView';

const meta: Meta<typeof RoutineTitleView> = {
  title: 'Pages/RoutineTitle/RoutineTitleView',
  component: RoutineTitleView,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onTitleChange: { action: 'title changed' },
    onSave: { action: 'save clicked' },
    onCancel: { action: 'cancel clicked' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;



export const Default: Story = {
  args: {
    titlePlaceholder: '루틴 이름을 입력하세요',
    form: {
      title: '테스트 루틴',
      isValid: true,
      error: undefined
    },
  },
};

export const WithDefaultTitle: Story = {
  args: {
    titlePlaceholder: '가슴 루틴 (12월 15일)',
    form: {
      title: '',
      isValid: false,
      error: undefined
    },
  },
};

export const WithError: Story = {
  args: {
    titlePlaceholder: '루틴 이름을 입력하세요',
    form: {
      title: '',
      isValid: false,
      error: '제목을 입력해주세요'
    },
  },
};

export const EmptyState: Story = {
  args: {
    titlePlaceholder: '복합 루틴 (12월 15일)',
    form: {
      title: '',
      isValid: false,
      error: undefined
    },
  },
}; 
