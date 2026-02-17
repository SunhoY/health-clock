import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseSelectionView } from './ExerciseSelectionView';
import { Exercise } from '../../types/exercise';

const mockExercises: Exercise[] = [
  {
    id: 'bench-press',
    name: '벤치프레스',
    bodyPart: 'chest',
    equipment: ['바벨', '벤치'],
    difficulty: 'intermediate'
  },
  {
    id: 'push-up',
    name: '푸쉬업',
    bodyPart: 'chest',
    equipment: [],
    difficulty: 'beginner'
  }
];

const mockOnExerciseSelect = jest.fn();
const mockOnEditExercise = jest.fn();
const mockOnDeleteExercise = jest.fn();
const mockOnBack = jest.fn();
const mockOnRetry = jest.fn();

describe('ExerciseSelectionView', () => {
  beforeEach(() => {
    mockOnExerciseSelect.mockClear();
    mockOnEditExercise.mockClear();
    mockOnDeleteExercise.mockClear();
    mockOnBack.mockClear();
    mockOnRetry.mockClear();
  });

  it('선택된 부위명이 제목에 올바르게 표시된다', () => {
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        onExerciseSelect={mockOnExerciseSelect}
      />
    );

    expect(screen.getByText('가슴 운동')).toBeInTheDocument();
  });

  it('해당 부위의 운동 목록이 모두 렌더링된다', () => {
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        onExerciseSelect={mockOnExerciseSelect}
      />
    );

    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('푸쉬업')).toBeInTheDocument();
  });

  it('운동 버튼 클릭 시 콜백 함수가 호출된다', async () => {
    const user = userEvent.setup();

    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        onExerciseSelect={mockOnExerciseSelect}
      />
    );

    await user.click(screen.getByText('벤치프레스'));

    expect(mockOnExerciseSelect).toHaveBeenCalledWith(mockExercises[0]);
  });

  it('빈 운동 목록일 때 적절한 메시지가 표시된다', () => {
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={[]}
        onExerciseSelect={mockOnExerciseSelect}
      />
    );

    expect(screen.getByText('선택된 부위에 해당하는 운동이 없습니다.')).toBeInTheDocument();
  });

  it('로딩 상태일 때 로딩 문구를 표시한다', () => {
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={[]}
        isLoading
        onExerciseSelect={mockOnExerciseSelect}
      />
    );

    expect(screen.getByText('운동 목록을 불러오는 중입니다.')).toBeInTheDocument();
    expect(
      screen.queryByText('선택된 부위에 해당하는 운동이 없습니다.')
    ).not.toBeInTheDocument();
  });

  it('에러 상태일 때 재시도 버튼을 표시하고 동작한다', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={[]}
        loadError="운동 목록을 불러오지 못했습니다."
        onRetry={mockOnRetry}
        onExerciseSelect={mockOnExerciseSelect}
      />
    );

    expect(
      screen.getByText('운동 목록을 불러오지 못했습니다.')
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('운동 목록에는 운동명만 표시된다', () => {
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        onExerciseSelect={mockOnExerciseSelect}
      />
    );

    expect(screen.queryByText('필요 장비:')).not.toBeInTheDocument();
    expect(screen.queryByText('난이도:')).not.toBeInTheDocument();
  });

  it('편집 모드에서는 > 대신 관리 메뉴 버튼이 표시된다', () => {
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        isEditMode
        onExerciseSelect={mockOnExerciseSelect}
        onEditExercise={mockOnEditExercise}
        onDeleteExercise={mockOnDeleteExercise}
        onBack={mockOnBack}
      />
    );

    expect(screen.getByRole('button', { name: '벤치프레스 관리 메뉴' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '돌아가기' })).toBeInTheDocument();
    expect(screen.queryByText('>')).not.toBeInTheDocument();
  });

  it('편집 모드에서 관리 메뉴 편집/삭제가 동작한다', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        isEditMode
        onExerciseSelect={mockOnExerciseSelect}
        onEditExercise={mockOnEditExercise}
        onDeleteExercise={mockOnDeleteExercise}
        onBack={mockOnBack}
      />
    );

    await user.click(screen.getByRole('button', { name: '벤치프레스 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '편집' }));
    expect(mockOnEditExercise).toHaveBeenCalledWith(mockExercises[0]);

    await user.click(screen.getByRole('button', { name: '벤치프레스 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '삭제' }));
    expect(mockOnDeleteExercise).toHaveBeenCalledWith(mockExercises[0]);
  });

  it('편집 모드에서 항목 롱클릭으로 관리 메뉴가 열린다', async () => {
    jest.useFakeTimers();

    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        isEditMode
        onExerciseSelect={mockOnExerciseSelect}
        onEditExercise={mockOnEditExercise}
        onDeleteExercise={mockOnDeleteExercise}
        onBack={mockOnBack}
      />
    );

    const card = screen.getByRole('button', { name: '벤치프레스 선택' });
    fireEvent.mouseDown(card);
    await act(async () => {
      jest.advanceTimersByTime(650);
    });
    expect(screen.queryByRole('dialog', { name: '운동 관리 메뉴' })).not.toBeInTheDocument();
    await act(async () => {
      jest.advanceTimersByTime(60);
    });
    fireEvent.mouseUp(card);

    expect(screen.getByRole('dialog', { name: '운동 관리 메뉴' })).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('편집 모드에서 돌아가기 버튼 클릭 시 onBack이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        isEditMode
        onExerciseSelect={mockOnExerciseSelect}
        onEditExercise={mockOnEditExercise}
        onDeleteExercise={mockOnDeleteExercise}
        onBack={mockOnBack}
      />
    );

    await user.click(screen.getByRole('button', { name: '돌아가기' }));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
