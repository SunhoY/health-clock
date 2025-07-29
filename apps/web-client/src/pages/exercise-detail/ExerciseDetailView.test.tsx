import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseDetailView } from './ExerciseDetailView';
import { Exercise, FormState, FormConfig } from '../../types/exercise';

const mockExercise: Exercise = {
  id: 'bench-press',
  name: '벤치프레스',
  bodyPart: 'chest',
  equipment: ['바벨', '벤치'],
  difficulty: 'intermediate'
};

const mockCardioExercise: Exercise = {
  id: 'treadmill',
  name: '러닝머신',
  bodyPart: 'cardio',
  equipment: ['러닝머신']
};

const mockFormState: FormState = {
  sets: 3,
  weight: 20,
  duration: 30,
  isValid: true,
  errors: {}
};

const mockFormConfig: FormConfig = {
  sets: { min: 1, max: 10, step: 1, default: 3 },
  weight: { min: 0, max: 500, step: 5, default: 20 },
  duration: { min: 1, max: 180, step: 1, default: 30 }
};

const mockOnSetsChange = jest.fn();
const mockOnWeightChange = jest.fn();
const mockOnDurationChange = jest.fn();
const mockOnAddExercise = jest.fn();
const mockOnCompleteRoutine = jest.fn();

describe('ExerciseDetailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('운동명이 제목에 올바르게 표시된다', () => {
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    expect(screen.getByText('벤치프레스 상세 설정')).toBeInTheDocument();
  });

  it('웨이트 운동일 때 모든 필드가 표시된다', () => {
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    expect(screen.getByText('세트 수')).toBeInTheDocument();
    expect(screen.getByText('중량')).toBeInTheDocument();
    expect(screen.queryByText('시간')).not.toBeInTheDocument();
  });

  it('유산소 운동일 때 중량 필드가 표시되지 않고 시간 필드가 표시된다', () => {
    render(
      <ExerciseDetailView
        exercise={mockCardioExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={true}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    expect(screen.getByText('세트 수')).toBeInTheDocument();
    expect(screen.getByText('시간')).toBeInTheDocument();
    expect(screen.queryByText('중량')).not.toBeInTheDocument();
  });

  it('액션 버튼들이 올바르게 렌더링된다', () => {
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    expect(screen.getByText('운동 추가')).toBeInTheDocument();
    expect(screen.getByText('루틴 완료')).toBeInTheDocument();
  });

  it('세트 수 증가 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    const incrementButton = screen.getAllByText('+')[0]; // 첫 번째 + 버튼 (세트 수)
    await user.click(incrementButton);
    
    expect(mockOnSetsChange).toHaveBeenCalledWith(4);
  });

  it('세트 수 감소 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    const decrementButton = screen.getAllByText('-')[0]; // 첫 번째 - 버튼 (세트 수)
    await user.click(decrementButton);
    
    expect(mockOnSetsChange).toHaveBeenCalledWith(2);
  });

  it('중량 증가 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    const incrementButton = screen.getAllByText('+')[1]; // 두 번째 + 버튼 (중량)
    await user.click(incrementButton);
    
    expect(mockOnWeightChange).toHaveBeenCalledWith(25);
  });

  it('운동 추가 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    const addButton = screen.getByText('운동 추가');
    await user.click(addButton);
    
    expect(mockOnAddExercise).toHaveBeenCalled();
  });

  it('루틴 완료 버튼 클릭 시 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    const completeButton = screen.getByText('루틴 완료');
    await user.click(completeButton);
    
    expect(mockOnCompleteRoutine).toHaveBeenCalled();
  });

  it('폼이 유효하지 않을 때 버튼들이 비활성화된다', () => {
    const invalidFormState: FormState = {
      ...mockFormState,
      isValid: false
    };
    
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={invalidFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    expect(screen.getByText('운동 추가')).toBeDisabled();
    expect(screen.getByText('루틴 완료')).toBeDisabled();
  });

  it('운동 정보가 올바르게 표시된다', () => {
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={mockFormState}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('chest')).toBeInTheDocument();
    expect(screen.getByText('바벨, 벤치')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
  });

  it('에러 메시지가 표시된다', () => {
    const formStateWithError: FormState = {
      ...mockFormState,
      errors: {
        sets: '세트 수는 1개 이상이어야 합니다.'
      }
    };
    
    render(
      <ExerciseDetailView
        exercise={mockExercise}
        formState={formStateWithError}
        formConfig={mockFormConfig}
        isCardio={false}
        onSetsChange={mockOnSetsChange}
        onWeightChange={mockOnWeightChange}
        onDurationChange={mockOnDurationChange}
        onAddExercise={mockOnAddExercise}
        onCompleteRoutine={mockOnCompleteRoutine}
      />
    );
    
    expect(screen.getByText('세트 수는 1개 이상이어야 합니다.')).toBeInTheDocument();
  });
}); 