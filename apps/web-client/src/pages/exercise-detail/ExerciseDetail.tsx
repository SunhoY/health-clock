import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExerciseDetailView } from './ExerciseDetailView';
import { EXERCISES_DATA, FORM_CONFIG, FormState, Exercise } from '../../types/exercise';

export function ExerciseDetail() {
  const { bodyPart, exerciseId } = useParams<{ bodyPart: string; exerciseId: string }>();
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [formState, setFormState] = useState<FormState>({
    sets: FORM_CONFIG.sets.default,
    weight: FORM_CONFIG.weight.default,
    duration: FORM_CONFIG.duration.default,
    isValid: true,
    errors: {}
  });

  useEffect(() => {
    if (bodyPart && exerciseId) {
      const exercises = EXERCISES_DATA[bodyPart] || [];
      const foundExercise = exercises.find(ex => ex.id === exerciseId);
      setExercise(foundExercise || null);
    }
  }, [bodyPart, exerciseId]);

  const isCardio = exercise?.bodyPart === 'cardio';

  const validateForm = (newFormState: FormState): FormState => {
    const errors: { sets?: string; weight?: string; duration?: string } = {};

    // 세트 수 검증
    if (newFormState.sets < FORM_CONFIG.sets.min || newFormState.sets > FORM_CONFIG.sets.max) {
      errors.sets = `세트 수는 ${FORM_CONFIG.sets.min}개에서 ${FORM_CONFIG.sets.max}개 사이여야 합니다.`;
    }

    // 웨이트 운동인 경우 중량 검증
    if (!isCardio) {
      if (newFormState.weight < FORM_CONFIG.weight.min || newFormState.weight > FORM_CONFIG.weight.max) {
        errors.weight = `중량은 ${FORM_CONFIG.weight.min}kg에서 ${FORM_CONFIG.weight.max}kg 사이여야 합니다.`;
      }
    }

    // 유산소 운동인 경우 시간 검증
    if (isCardio) {
      if (newFormState.duration < FORM_CONFIG.duration.min || newFormState.duration > FORM_CONFIG.duration.max) {
        errors.duration = `시간은 ${FORM_CONFIG.duration.min}분에서 ${FORM_CONFIG.duration.max}분 사이여야 합니다.`;
      }
    }

    const isValid = Object.keys(errors).length === 0;

    return {
      ...newFormState,
      errors,
      isValid
    };
  };

  const handleSetsChange = (sets: number) => {
    const newFormState = { ...formState, sets };
    setFormState(validateForm(newFormState));
  };

  const handleWeightChange = (weight: number) => {
    const newFormState = { ...formState, weight };
    setFormState(validateForm(newFormState));
  };

  const handleDurationChange = (duration: number) => {
    const newFormState = { ...formState, duration };
    setFormState(validateForm(newFormState));
  };

  const handleAddExercise = () => {
    if (!exercise || !formState.isValid) return;

    const exerciseDetail = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      sets: formState.sets,
      weight: isCardio ? undefined : formState.weight,
      duration: isCardio ? formState.duration : undefined,
      restTime: 60 // 기본 휴식 시간 60초
    };

    console.log('운동 추가:', exerciseDetail);
    // TODO: 루틴에 운동 추가 로직 구현
  };

  const handleCompleteRoutine = () => {
    if (!exercise || !formState.isValid) return;

    const exerciseDetail = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      sets: formState.sets,
      weight: isCardio ? undefined : formState.weight,
      duration: isCardio ? formState.duration : undefined,
      restTime: 60
    };

    console.log('루틴 완료:', exerciseDetail);
    // TODO: 루틴 완료 및 다음 화면으로 라우팅
  };

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">운동을 찾을 수 없습니다</h1>
          <p className="text-gray-400">선택한 운동이 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <ExerciseDetailView
      exercise={exercise}
      formState={formState}
      formConfig={FORM_CONFIG}
      isCardio={isCardio}
      onSetsChange={handleSetsChange}
      onWeightChange={handleWeightChange}
      onDurationChange={handleDurationChange}
      onAddExercise={handleAddExercise}
      onCompleteRoutine={handleCompleteRoutine}
    />
  );
} 