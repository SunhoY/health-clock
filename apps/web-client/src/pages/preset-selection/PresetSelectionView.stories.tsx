import type { Meta, StoryObj } from '@storybook/react';
import { PresetSelectionView } from './PresetSelectionView';

const meta: Meta<typeof PresetSelectionView> = {
  title: 'Pages/PresetSelection/PresetSelectionView',
  component: PresetSelectionView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockPresets = [
  {
    id: '1',
    title: '전신 운동',
    exercises: [
      { id: '1', part: '전신', name: '스쿼트', sets: 3, weight: 50 },
      { id: '2', part: '상체', name: '푸시업', sets: 3 },
      { id: '3', part: '하체', name: '런지', sets: 3, weight: 20 },
    ],
    createdAt: new Date('2024-01-01'),
    lastUsed: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: '상체 집중',
    exercises: [
      { id: '4', part: '가슴', name: '벤치프레스', sets: 4, weight: 80 },
      { id: '5', part: '등', name: '로우', sets: 4, weight: 60 },
      { id: '6', part: '어깨', name: '밀리터리프레스', sets: 3, weight: 40 },
    ],
    createdAt: new Date('2024-01-10'),
    lastUsed: new Date('2024-01-20'),
  },
];

export const Default: Story = {
  args: {
    presets: mockPresets,
    onPresetSelect: (presetId: string) => {
      console.log('선택된 프리셋:', presetId);
    },
    onAddWorkout: () => {
      console.log('새로운 루틴 만들기');
    },
  },
};

export const Empty: Story = {
  args: {
    presets: [],
    onPresetSelect: (presetId: string) => {
      console.log('선택된 프리셋:', presetId);
    },
    onAddWorkout: () => {
      console.log('새로운 루틴 만들기');
    },
  },
}; 