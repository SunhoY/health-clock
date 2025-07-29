import type { Meta, StoryObj } from '@storybook/react';
import { RoutineTitleView } from './RoutineTitleView';
import { RoutineTitleForm } from '../../types/exercise';

const meta: Meta<typeof RoutineTitleView> = {
  title: 'Pages/RoutineTitle/RoutineTitleView',
  component: RoutineTitleView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockOnTitleChange = (title: string) => console.log('Title changed:', title);
const mockOnSave = () => console.log('Save clicked');
const mockOnCancel = () => console.log('Cancel clicked');

export const Default: Story = {
  args: {
    form: {
      title: '테스트 루틴',
      isValid: true,
      error: undefined
    },
    onTitleChange: mockOnTitleChange,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  },
};

export const WithDefaultTitle: Story = {
  args: {
    form: {
      title: '가슴 루틴 (12월 15일)',
      isValid: true,
      error: undefined
    },
    onTitleChange: mockOnTitleChange,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  },
};

export const WithError: Story = {
  args: {
    form: {
      title: '',
      isValid: false,
      error: '제목을 입력해주세요'
    },
    onTitleChange: mockOnTitleChange,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  },
};

export const EmptyState: Story = {
  args: {
    form: {
      title: '',
      isValid: false,
      error: undefined
    },
    onTitleChange: mockOnTitleChange,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  },
}; 