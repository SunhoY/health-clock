import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseDetailView } from './ExerciseDetailView';
import { Exercise, FormConfig } from '../../types/exercise';

const mockExercise: Exercise = {
  id: 'bench-press',
  name: '벤치프레스',
  bodyPart: 'chest'
};

const mockCardioExercise: Exercise = {
  id: 'treadmill',
  name: '러닝머신',
  bodyPart: 'cardio'
};

const setRange: FormConfig['sets'] = { min: 1, max: 10, step: 1, default: 3 };

const mockOnSetCountChange = jest.fn();
const mockOnStrengthSetChange = jest.fn();
const mockOnStrengthSetStepChange = jest.fn();
const mockOnDurationInputChange = jest.fn();
const mockOnAddExercise = jest.fn();
const mockOnCompleteRoutine = jest.fn();

const defaultProps = {
  setCount: 3,
  setRange,
  strengthSets: [
    { setNumber: 1, weightInput: undefined, repsInput: undefined, weightTouched: false, repsTouched: false },
    { setNumber: 2, weightInput: undefined, repsInput: undefined, weightTouched: false, repsTouched: false },
    { setNumber: 3, weightInput: undefined, repsInput: undefined, weightTouched: false, repsTouched: false }
  ],
  strengthErrors: {},
  durationInput: '30',
  durationError: undefined,
  isFormValid: true,
  onSetCountChange: mockOnSetCountChange,
  onStrengthSetChange: mockOnStrengthSetChange,
  onStrengthSetStepChange: mockOnStrengthSetStepChange,
  onDurationInputChange: mockOnDurationInputChange,
  onAddExercise: mockOnAddExercise,
  onCompleteRoutine: mockOnCompleteRoutine
};

describe('ExerciseDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('근력 운동에서 세트별 입력 행이 렌더링된다', () => {
    render(<ExerciseDetailView {...defaultProps} exercise={mockExercise} isCardio={false} />);

    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByTestId('strength-set-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('strength-set-row-3')).toBeInTheDocument();
  });

  it('횟수 라벨은 reps 표기 없이 출력된다', () => {
    render(<ExerciseDetailView {...defaultProps} exercise={mockExercise} isCardio={false} />);

    expect(screen.getAllByText('횟수')).toHaveLength(3);
    expect(screen.queryByText('횟수(reps)')).not.toBeInTheDocument();
  });

  it('세트 수 증가/감소 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(<ExerciseDetailView {...defaultProps} exercise={mockExercise} isCardio={false} />);

    await user.click(screen.getByRole('button', { name: '세트 수 증가' }));
    await user.click(screen.getByRole('button', { name: '세트 수 감소' }));

    expect(mockOnSetCountChange).toHaveBeenCalledWith(4);
    expect(mockOnSetCountChange).toHaveBeenCalledWith(2);
  });

  it('중량/횟수 증감 버튼 클릭 시 step 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(<ExerciseDetailView {...defaultProps} exercise={mockExercise} isCardio={false} />);

    await user.click(screen.getByRole('button', { name: '1세트 중량 증가' }));
    await user.click(screen.getByRole('button', { name: '1세트 중량 감소' }));
    await user.click(screen.getByRole('button', { name: '1세트 횟수 증가' }));
    await user.click(screen.getByRole('button', { name: '1세트 횟수 감소' }));

    expect(mockOnStrengthSetStepChange).toHaveBeenCalledWith(1, 'weight', 5);
    expect(mockOnStrengthSetStepChange).toHaveBeenCalledWith(1, 'weight', -5);
    expect(mockOnStrengthSetStepChange).toHaveBeenCalledWith(1, 'reps', 1);
    expect(mockOnStrengthSetStepChange).toHaveBeenCalledWith(1, 'reps', -1);
  });

  it('직접 입력 시 change 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(<ExerciseDetailView {...defaultProps} exercise={mockExercise} isCardio={false} />);

    const firstWeightInput = screen.getAllByLabelText('중량(kg)')[0];
    await user.type(firstWeightInput, '25');

    expect(mockOnStrengthSetChange).toHaveBeenCalled();
  });

  it('유산소 운동일 때 시간 입력만 렌더링된다', () => {
    render(<ExerciseDetailView {...defaultProps} exercise={mockCardioExercise} isCardio={true} />);

    expect(screen.getByLabelText('시간(분)')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '세트 수 증가' })).not.toBeInTheDocument();
  });

  it('폼이 유효하지 않으면 하단 버튼이 비활성화된다', () => {
    render(
      <ExerciseDetailView
        {...defaultProps}
        exercise={mockExercise}
        isCardio={false}
        isFormValid={false}
      />
    );

    expect(screen.getByText('운동 더 추가')).toBeDisabled();
    expect(screen.getByText('완료')).toBeDisabled();
  });

  it('하단 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(<ExerciseDetailView {...defaultProps} exercise={mockExercise} isCardio={false} />);

    await user.click(screen.getByText('운동 더 추가'));
    await user.click(screen.getByText('완료'));

    expect(mockOnAddExercise).toHaveBeenCalled();
    expect(mockOnCompleteRoutine).toHaveBeenCalled();
  });
});
