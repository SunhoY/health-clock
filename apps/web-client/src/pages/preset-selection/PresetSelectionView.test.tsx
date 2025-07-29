import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PresetSelectionView } from './PresetSelectionView';

const mockPresets = [
  {
    id: '1',
    title: '전신 운동',
    exercises: [
      { id: '1', part: '전신', name: '스쿼트', sets: 3, weight: 50 },
      { id: '2', part: '상체', name: '푸시업', sets: 3 },
    ],
    createdAt: new Date('2024-01-01'),
    lastUsed: new Date('2024-01-15'),
  },
];

const mockOnPresetSelect = jest.fn();
const mockOnAddWorkout = jest.fn();

beforeEach(() => {
  mockOnPresetSelect.mockClear();
  mockOnAddWorkout.mockClear();
});

describe('PresetSelectionView', () => {
  it('프리셋이 있을 때 올바르게 렌더링된다', () => {
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
      />
    );

    expect(screen.getByText('운동 루틴 선택')).toBeInTheDocument();
    expect(screen.getByText('전신 운동')).toBeInTheDocument();
    expect(screen.getByText('2개의 운동')).toBeInTheDocument();
    expect(screen.getByText('스쿼트')).toBeInTheDocument();
    expect(screen.getByText('푸시업')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '새로운 루틴 만들기' })).toBeInTheDocument();
  });

  it('프리셋이 없을 때 빈 상태 화면이 표시된다', () => {
    render(
      <PresetSelectionView
        presets={[]}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
      />
    );

    expect(screen.getByText('운동 루틴 선택')).toBeInTheDocument();
    expect(screen.getByText('저장된 운동 루틴이 없습니다')).toBeInTheDocument();
    expect(screen.getByText('새로운 운동 루틴을 만들어보세요')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '운동 루틴 만들기' })).toBeInTheDocument();
  });

  it('프리셋 카드 클릭 시 onPresetSelect 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
      />
    );

    const presetCard = screen.getByText('전신 운동');
    await user.click(presetCard);

    expect(mockOnPresetSelect).toHaveBeenCalledWith('1');
  });

  it('새로운 루틴 만들기 버튼 클릭 시 onAddWorkout 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
      />
    );

    const addButton = screen.getByRole('button', { name: '새로운 루틴 만들기' });
    await user.click(addButton);

    expect(mockOnAddWorkout).toHaveBeenCalledTimes(1);
  });

  it('빈 상태에서 운동 루틴 만들기 버튼 클릭 시 onAddWorkout 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <PresetSelectionView
        presets={[]}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
      />
    );

    const addButton = screen.getByRole('button', { name: '운동 루틴 만들기' });
    await user.click(addButton);

    expect(mockOnAddWorkout).toHaveBeenCalledTimes(1);
  });
}); 