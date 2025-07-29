# 개발 계획서: P-06 루틴 저장 - 제목 입력 팝업

---

## 📌 개발 목표

- 운동 구성이 완료된 후 루틴에 이름을 부여할 수 있는 팝업/모달 화면 구현
- 직관적이고 간단한 텍스트 입력 인터페이스 제공
- 기본값 제공 및 유효성 검사를 통한 사용자 경험 개선
- 루틴 저장 완료 후 적절한 화면으로 라우팅

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `RoutineTitleModal`: 제목 입력 모달/팝업 전체 레이아웃
- `TitleInput`: 제목 입력 필드 컴포넌트
- `ModalHeader`: 모달 헤더 (제목, 닫기 버튼)
- `ConfirmButton`: 확인 버튼 컴포넌트
- `ModalOverlay`: 모달 배경 오버레이

### Container Components
- `RoutineTitleContainer`: 제목 입력 로직 및 저장 처리 담당

---

## ⚙️ 필요한 기능 및 상태 관리

### 상태 관리
- 입력된 제목 텍스트
- 모달 표시 상태
- 저장 중 로딩 상태
- 유효성 검사 상태 및 에러

### 주요 기능
- 기본 제목 자동 생성 (마지막 선택 부위명 기반)
- 제목 입력 및 유효성 검사
- 루틴 데이터 저장 처리
- 저장 완료 후 프리셋 선택 화면으로 라우팅
- 모달 외부 클릭 또는 ESC 키로 취소 가능

### 데이터 모델
```typescript
interface RoutineTitleForm {
  title: string;
  isValid: boolean;
  error?: string;
}

interface SaveRoutinePayload {
  title: string;
  exercises: ExerciseDetail[];
  createdAt: Date;
}

interface ValidationRules {
  title: {
    minLength: number;
    maxLength: number;
    pattern?: RegExp;
    forbiddenWords?: string[];
  };
}
```

---

## 🧪 테스트 계획

### Unit Tests (`RoutineTitleModal.test.tsx`)
- [ ] 모달이 올바르게 렌더링되는지 확인
- [ ] 기본 제목이 입력 필드에 표시되는지 확인
- [ ] 제목 변경 시 상태가 업데이트되는지 확인
- [ ] 유효하지 않은 입력 시 에러 메시지 표시

### Unit Tests (`TitleInput.test.tsx`)
- [ ] 초기값이 올바르게 표시
- [ ] 텍스트 입력 시 onChange 콜백 호출
- [ ] 유효성 검사 에러 상태 표시
- [ ] 포커스 및 블러 이벤트 처리
- [ ] 키보드 이벤트 처리 (Enter, ESC)

### Integration Tests (`RoutineTitleContainer.test.tsx`)
- [ ] 기본 제목 생성 로직 테스트
- [ ] 제목 유효성 검사 테스트
- [ ] 루틴 저장 프로세스 테스트
- [ ] 저장 성공 시 라우팅 테스트
- [ ] 저장 실패 시 에러 처리 테스트

---

## 📚 스토리북 계획

### Stories (`RoutineTitleModal.stories.tsx`)
- [ ] Default: 기본 상태의 모달
- [ ] WithDefaultTitle: 기본 제목이 설정된 상태
- [ ] WithError: 유효성 검사 에러가 있는 상태
- [ ] Loading: 저장 중 로딩 상태
- [ ] EmptyState: 빈 제목으로 시작하는 상태

### Stories (`TitleInput.stories.tsx`)
- [ ] Default: 기본 입력 필드
- [ ] WithPlaceholder: 플레이스홀더가 있는 입력 필드
- [ ] WithError: 에러 상태의 입력 필드
- [ ] Focused: 포커스된 상태의 입력 필드
- [ ] Disabled: 비활성화된 입력 필드

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 기본 컴포넌트 구현
- [ ] `TitleInput` 컴포넌트 구현
- [ ] 입력 필드 스타일링 및 상태 관리
- [ ] 키보드 이벤트 핸들링 (Enter, ESC)

### 2단계: 모달 컴포넌트 구현
- [ ] `ModalOverlay` 컴포넌트 구현
- [ ] `ModalHeader` 컴포넌트 구현
- [ ] `RoutineTitleModal` 전체 레이아웃 구현
- [ ] 모달 열기/닫기 애니메이션

### 3단계: 테스트 작성
- [ ] `TitleInput` 단위 테스트 작성
- [ ] `RoutineTitleModal` 단위 테스트 작성
- [ ] 키보드 네비게이션 테스트
- [ ] 접근성 테스트

### 4단계: 스토리북 설정
- [ ] `TitleInput` 스토리 작성
- [ ] `RoutineTitleModal` 스토리 작성
- [ ] 다양한 상태의 스토리 구현
- [ ] 인터랙션 테스트 추가

### 5단계: 유효성 검사 및 비즈니스 로직
- [ ] 제목 유효성 검사 함수 구현
- [ ] 기본 제목 생성 로직 구현
- [ ] 저장 프로세스 로직 구현
- [ ] 에러 핸들링 로직 구현

### 6단계: Container Component 구현
- [ ] `RoutineTitleContainer` 구현
- [ ] 폼 상태 관리 구현
- [ ] 저장 및 라우팅 로직 구현
- [ ] 모달 제어 로직 구현

### 7단계: 통합 및 최적화
- [ ] 전체 루틴 생성 플로우 통합 테스트
- [ ] 모달 애니메이션 및 UX 개선
- [ ] 성능 최적화
- [ ] 접근성 개선

### 8단계: 에러 시나리오 처리
- [ ] 네트워크 에러 처리
- [ ] 저장 공간 부족 에러 처리
- [ ] 중복 제목 검사 (선택적)
- [ ] 재시도 메커니즘 구현

---

## 🔧 기술적 고려사항

### 의존성
- 루틴 생성 컨텍스트 (이전 단계 데이터)
- 로컬 스토리지 또는 IndexedDB (데이터 저장)
- React Router (라우팅)
- 폼 검증 라이브러리 (Yup, Zod 등)

### 파일 구조
```
src/
  pages/
    create-routine/
      routine-title/
        components/
          RoutineTitleModal.tsx
          RoutineTitleModal.test.tsx
          RoutineTitleModal.stories.tsx
          TitleInput.tsx
          TitleInput.test.tsx
          TitleInput.stories.tsx
          ModalHeader.tsx
          ModalOverlay.tsx
          ConfirmButton.tsx
        containers/
          RoutineTitleContainer.tsx
          RoutineTitleContainer.test.tsx
        hooks/
          useTitleValidation.ts
          useTitleValidation.test.ts
        utils/
          titleGenerator.ts
          titleGenerator.test.ts
        index.ts
```

### 유효성 검사 규칙
```typescript
const VALIDATION_RULES: ValidationRules = {
  title: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[가-힣a-zA-Z0-9\s\-_]+$/,
    forbiddenWords: ['undefined', 'null', 'test']
  }
};

const generateDefaultTitle = (exercises: ExerciseDetail[]): string => {
  const bodyParts = [...new Set(exercises.map(ex => ex.bodyPart))];
  const today = new Date().toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  if (bodyParts.length === 1) {
    return `${bodyParts[0]} 루틴 (${today})`;
  } else {
    return `복합 루틴 (${today})`;
  }
};
```

### 접근성 고려사항
- 모달에 적절한 role 및 aria 속성 설정
- 포커스 트랩핑 (모달 내에서만 포커스 이동)
- ESC 키로 모달 닫기 지원
- 스크린 리더를 위한 라벨 및 설명 제공
- 키보드만으로 모든 기능 사용 가능

### 모달 UX 고려사항
- 부드러운 fade-in/fade-out 애니메이션
- 백그라운드 스크롤 방지
- 모달 외부 클릭 시 닫기 (선택적)
- 저장 중 상태 표시 및 버튼 비활성화

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 기본 제목이 자동으로 생성되어 표시
- [ ] 제목 유효성 검사 및 에러 처리 완료
- [ ] 저장 성공 시 프리셋 선택 화면으로 정상 이동
- [ ] 모달 애니메이션 및 UX 구현 완료
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 키보드 네비게이션 완전 지원
- [ ] 에러 상황에 대한 적절한 피드백 제공
- [ ] 저장 중 로딩 상태 표시 