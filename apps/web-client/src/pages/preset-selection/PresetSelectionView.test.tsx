import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PresetSelectionView } from './PresetSelectionView';

const mockPresets = [
  {
    id: '1',
    title: '전신 운동',
    exercises: [
      { id: '1', part: '전신', name: '스쿼트', sets: 3, weight: 50 },
      { id: '2', part: '상체', name: '푸시업', sets: 3 }
    ],
    createdAt: new Date('2024-01-01'),
    lastUsed: new Date('2024-01-15')
  }
];

const mockOnPresetSelect = jest.fn();
const mockOnAddWorkout = jest.fn();
const mockOnEditPreset = jest.fn();
const mockOnDeletePreset = jest.fn();

beforeEach(() => {
  mockOnPresetSelect.mockClear();
  mockOnAddWorkout.mockClear();
  mockOnEditPreset.mockClear();
  mockOnDeletePreset.mockClear();
});

describe('PresetSelectionView', () => {
  it('프리셋이 있을 때 올바르게 렌더링된다', () => {
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    expect(screen.getByText('운동 루틴 선택')).toBeInTheDocument();
    expect(screen.getByText('전신 운동')).toBeInTheDocument();
    expect(screen.getByText('2개 운동')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '루틴 만들기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전신 운동 관리 메뉴' })).toBeInTheDocument();
  });

  it('프리셋이 없을 때 빈 상태 화면이 표시된다', () => {
    render(
      <PresetSelectionView
        presets={[]}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    expect(screen.getByText('운동 루틴 선택')).toBeInTheDocument();
    expect(screen.getByText('저장된 루틴이 없습니다.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '루틴 만들기' })).toBeInTheDocument();
  });

  it('프리셋 카드 클릭 시 onPresetSelect 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    await user.click(screen.getByText('전신 운동'));

    expect(mockOnPresetSelect).toHaveBeenCalledWith('1');
  });

  it('햄버거 버튼 클릭 시 액션 메뉴가 열린다', async () => {
    const user = userEvent.setup();
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    await user.click(screen.getByRole('button', { name: '전신 운동 관리 메뉴' }));

    expect(screen.getByRole('dialog', { name: '루틴 관리 메뉴' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '편집' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();
    expect(mockOnPresetSelect).not.toHaveBeenCalled();
  });

  it('롱클릭 시 액션 메뉴가 열린다', async () => {
    jest.useFakeTimers();

    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    const card = screen.getByRole('button', { name: '전신 운동 선택' });
    fireEvent.mouseDown(card);
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    expect(screen.queryByRole('dialog', { name: '루틴 관리 메뉴' })).not.toBeInTheDocument();
    await act(async () => {
      jest.advanceTimersByTime(550);
    });
    fireEvent.mouseUp(card);

    expect(screen.getByRole('dialog', { name: '루틴 관리 메뉴' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '편집' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('카드 우클릭(컨텍스트 메뉴)을 막는다', () => {
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    const card = screen.getByRole('button', { name: '전신 운동 선택' });
    const blocked = !card.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    );

    expect(blocked).toBe(true);
  });

  it('편집 클릭 시 onEditPreset 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    await user.click(screen.getByRole('button', { name: '전신 운동 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '편집' }));

    expect(mockOnEditPreset).toHaveBeenCalledWith('1');
  });

  it('삭제 클릭 시 onDeletePreset 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    await user.click(screen.getByRole('button', { name: '전신 운동 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(mockOnDeletePreset).toHaveBeenCalledWith('1');
  });

  it('루틴 만들기 버튼 클릭 시 onAddWorkout 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <PresetSelectionView
        presets={mockPresets}
        onPresetSelect={mockOnPresetSelect}
        onAddWorkout={mockOnAddWorkout}
        onEditPreset={mockOnEditPreset}
        onDeletePreset={mockOnDeletePreset}
      />
    );

    const addButton = screen.getByRole('button', { name: '루틴 만들기' });
    await user.click(addButton);

    expect(mockOnAddWorkout).toHaveBeenCalledTimes(1);
  });
});
