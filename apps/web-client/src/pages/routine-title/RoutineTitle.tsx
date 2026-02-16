import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutineTitleView } from './RoutineTitleView';
import { 
  RoutineTitleForm,
  ExerciseDetail 
} from '../../types/exercise';

// 임시로 루틴 데이터를 저장할 상태 (실제로는 전역 상태 관리나 API를 사용)
let tempRoutineData: ExerciseDetail[] = [];

export function RoutineTitle() {
  const navigate = useNavigate();
  const titlePlaceholder = '저장할 루틴의 제목을 입력해주세요';
  const [form, setForm] = useState<RoutineTitleForm>({
    title: '',
    isValid: false,
    error: undefined
  });

  const validateTitle = (title: string): RoutineTitleForm => {
    let error: string | undefined;

    if (title.trim().length === 0) {
      error = '제목을 입력해주세요';
    }

    return {
      title,
      isValid: !error,
      error
    };
  };

  const handleTitleChange = (title: string) => {
    const validatedForm = validateTitle(title);
    setForm(validatedForm);
  };

  const handleSave = () => {
    if (!form.isValid) return;

    const savePayload = {
      title: form.title,
      exercises: getTempRoutineData(),
      createdAt: new Date()
    };

    console.log('루틴 저장:', savePayload);
    
    // TODO: 실제 저장 로직 구현 (API 호출 등)
    
    // 저장 완료 후 프리셋 선택 화면으로 이동
    navigate('/preset-selection');
  };

  const handleCancel = () => {
    // 취소 시 이전 단계(S-05)로 복귀
    navigate(-1);
  };

  return (
    <RoutineTitleView
      form={form}
      titlePlaceholder={titlePlaceholder}
      onTitleChange={handleTitleChange}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}

// 임시 함수: 루틴 데이터 설정 (실제로는 전역 상태 관리나 라우터 상태를 사용)
export const setTempRoutineData = (exercises: ExerciseDetail[]) => {
  tempRoutineData = exercises;
};

export const getTempRoutineData = (): ExerciseDetail[] => {
  return tempRoutineData;
};

export const appendTempRoutineData = (exercise: ExerciseDetail) => {
  tempRoutineData = [...tempRoutineData, exercise];
};

export const clearTempRoutineData = () => {
  tempRoutineData = [];
};
