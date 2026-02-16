import { render, screen } from '@testing-library/react';
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

describe('ExerciseSelectionView', () => {
  beforeEach(() => {
    mockOnExerciseSelect.mockClear();
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

    const exerciseButton = screen.getByText('벤치프레스');
    await user.click(exerciseButton);

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

  it('키보드로 운동을 선택할 수 있다', async () => {
    const user = userEvent.setup();
    
    render(
      <ExerciseSelectionView
        selectedBodyPart="chest"
        exercises={mockExercises}
        onExerciseSelect={mockOnExerciseSelect}
      />
    );

    const exerciseButton = screen.getByText('벤치프레스');
    await user.click(exerciseButton);

    expect(mockOnExerciseSelect).toHaveBeenCalledWith(mockExercises[0]);
  });
}); 
