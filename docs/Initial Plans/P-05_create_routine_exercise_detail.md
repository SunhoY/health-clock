# 개발 계획서: P-05 루틴 만들기 - 세부 항목 입력 화면

---

## 📌 개발 목표

- 선택된 운동의 세트 수, 중량, 시간을 입력할 수 있는 직관적인 인터페이스 구현
- 스피너 방식의 숫자 입력 컨트롤을 통한 빠른 데이터 입력 지원
- 웨이트 운동과 유산소 운동에 따른 조건부 입력 필드 처리
- 루틴에 운동을 추가하거나 루틴 생성을 완료하는 플로우 제어

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `ExerciseDetailView`: 운동 상세 입력 화면 전체 레이아웃 (폼, 스피너, 버튼 포함)

### Controller Components
- `ExerciseDetail`: 입력 데이터 관리 및 폼 제출 로직 담당

---

## ⚙️ 필요한 기능

### 주요 기능
- 운동 타입에 따른 조건부 필드 표시 (유산소는 중량 입력 비활성화)
- 스피너를 통한 숫자 입력 (세트: 1씩, 중량: 5씩, 시간: 1씩 증감)
- 폼 유효성 검사 (최소값, 최대값 검증)
- 운동 추가 및 루틴 완료 로직
- 운동 선택 화면에서 운동 선택 시 이 화면으로 라우팅

### 데이터 모델
```typescript
interface ExerciseDetail {
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  sets: number;
  weight?: number; // 유산소 운동일 경우 null
  duration?: number; // 유산소 운동일 경우 필수
  restTime?: number; // 세트 간 휴식 시간 (기본값 설정)
}

interface FormState {
  sets: number;
  weight: number;
  duration: number;
  isValid: boolean;
  errors: {
    sets?: string;
    weight?: string;
    duration?: string;
  };
}

interface FormConfig {
  sets: {
    min: number;
    max: number;
    step: number;
    default: number;
  };
  weight: {
    min: number;
    max: number;
    step: number;
    default: number;
  };
  duration: {
    min: number;
    max: number;
    step: number;
    default: number;
  };
}

const FORM_CONFIG: FormConfig = {
  sets: { min: 1, max: 10, step: 1, default: 3 },
  weight: { min: 0, max: 500, step: 5, default: 20 },
  duration: { min: 1, max: 180, step: 1, default: 30 }
};
```

---

## 🧪 테스트 계획

### Unit Tests (`ExerciseDetailView.test.tsx`)
- [ ] 운동명이 제목에 올바르게 표시
- [ ] 웨이트 운동일 때 모든 필드가 표시
- [ ] 유산소 운동일 때 중량 필드가 비활성화
- [ ] 액션 버튼들이 올바르게 렌더링
- [ ] 스피너 증가/감소 버튼 동작 확인

### Unit Tests (`ExerciseDetail.test.tsx`)
- [ ] 폼 데이터 변경 시 상태 업데이트
- [ ] 운동 추가 시 콘솔에 로그 출력
- [ ] 루틴 완료 시 콘솔에 로그 출력
- [ ] 유효성 검사 로직 동작 확인

---

## 📚 스토리북 계획

### Stories (`ExerciseDetailView.stories.tsx`)
- [ ] WeightExercise: 웨이트 운동 (벤치프레스) 입력 화면
- [ ] CardioExercise: 유산소 운동 (러닝머신) 입력 화면
- [ ] WithErrors: 유효성 검사 에러가 있는 상태

### Stories (`ExerciseDetail.stories.tsx`)
- [ ] Default: 기본 운동 상세 입력 화면 (라우터 컨텍스트 포함)

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 구조 정의
- [ ] 운동 상세 정보 타입 정의
- [ ] 폼 설정 및 검증 규칙 정의

### 2단계: Presentational Component 구현
- [ ] `ExerciseDetailView` 컴포넌트 구현 (폼, 스피너, 버튼 포함)

### 3단계: 테스트 작성
- [ ] `ExerciseDetailView` 단위 테스트 작성
- [ ] 접근성 테스트 포함

### 4단계: 스토리북 설정
- [ ] `ExerciseDetailView` 스토리 작성
- [ ] `ExerciseDetail` 스토리 작성

### 5단계: Controller Component 구현
- [ ] `ExerciseDetail` 구현
- [ ] 폼 상태 관리 로직 구현
- [ ] 운동 추가 및 루틴 완료 로직 구현

### 6단계: 통합 테스트
- [ ] `ExerciseDetail` 컴포넌트 테스트 작성

### 7단계: 스타일링 및 UX 개선
- [ ] 반응형 폼 레이아웃 구현
- [ ] 호버 및 포커스 상태 스타일링
- [ ] 스피너 애니메이션 효과 추가
- [ ] 접근성 개선 (키보드 네비게이션, 스크린 리더 지원)

### 8단계: 라우팅 연결
- [ ] App.tsx에 운동 상세 입력 화면 라우트 추가
- [ ] 운동 선택 화면에서 운동 선택 시 이 화면으로 라우팅 연결

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅
- CSS Grid 또는 Flexbox for 레이아웃

### 파일 구조
```
src/
  pages/
    exercise-detail/
      ExerciseDetailView.tsx
      ExerciseDetailView.test.tsx
      ExerciseDetailView.stories.tsx
      ExerciseDetail.tsx
      ExerciseDetail.test.tsx
      ExerciseDetail.stories.tsx
      index.ts
```

### Clean Architecture 적용
- **Presentation Layer**: `ExerciseDetailView` - UI 표시만 담당
- **Application Layer**: `ExerciseDetail` - 비즈니스 로직 및 라우팅 담당

### 접근성 고려사항
- 스피너 버튼에 적절한 ARIA 레이블
- 폼 필드와 에러 메시지 연결
- 키보드 네비게이션 지원
- 스크린 리더를 위한 상태 변화 알림

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 폼 상태의 메모이제이션

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 웨이트 운동과 유산소 운동에 따른 조건부 필드 처리
- [ ] 스피너를 통한 정확한 증감 동작
- [ ] 폼 유효성 검사 및 에러 처리
- [ ] 운동 추가 시 콘솔에 로그 출력
- [ ] 루틴 완료 시 콘솔에 로그 출력
- [ ] 반응형 디자인 구현
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 키보드만으로 모든 기능 사용 가능
- [ ] 직관적이고 사용하기 쉬운 인터페이스
- [ ] 운동 선택 화면에서 운동 선택 시 이 화면으로 정상 이동 