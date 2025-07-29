import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutineTitleView } from './RoutineTitleView';
import { 
  RoutineTitleForm, 
  VALIDATION_RULES, 
  generateDefaultTitle,
  ExerciseDetail 
} from '../../types/exercise';

// 임시로 루틴 데이터를 저장할 상태 (실제로는 전역 상태 관리나 API를 사용)
let tempRoutineData: ExerciseDetail[] = [];

export function RoutineTitle() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RoutineTitleForm>({
    title: '',
    isValid: false,
    error: undefined
  });

  useEffect(() => {
    // 기본 제목 생성
    const defaultTitle = generateDefaultTitle(tempRoutineData);
    const initialForm = validateTitle(defaultTitle);
    setForm(initialForm);
  }, []);

  const validateTitle = (title: string): RoutineTitleForm => {
    const rules = VALIDATION_RULES.title;
    let error: string | undefined;

    // 최소 길이 검증
    if (title.length < rules.minLength) {
      error = '제목을 입력해주세요';
    }
    // 최대 길이 검증
    else if (title.length > rules.maxLength) {
      error = `제목은 ${rules.maxLength}자 이하여야 합니다`;
    }
    // 패턴 검증
    else if (rules.pattern && !rules.pattern.test(title)) {
      error = '제목에는 한글, 영문, 숫자, 공백, 하이픈, 언더스코어만 사용할 수 있습니다';
    }
    // 금지어 검증
    else if (rules.forbiddenWords && rules.forbiddenWords.some(word => 
      title.toLowerCase().includes(word.toLowerCase())
    )) {
      error = '사용할 수 없는 단어가 포함되어 있습니다';
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
      exercises: tempRoutineData,
      createdAt: new Date()
    };

    console.log('루틴 저장:', savePayload);
    
    // TODO: 실제 저장 로직 구현 (API 호출 등)
    
    // 저장 완료 후 프리셋 선택 화면으로 이동
    navigate('/preset-selection');
  };

  const handleCancel = () => {
    // 취소 시 프리셋 선택 화면으로 이동
    navigate('/preset-selection');
  };

  return (
    <RoutineTitleView
      form={form}
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