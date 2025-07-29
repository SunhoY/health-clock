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
- `RoutineTitleView`: 제목 입력 모달/팝업 전체 레이아웃 (입력 필드, 버튼 포함)

### Controller Components
- `RoutineTitle`: 제목 입력 로직 및 저장 처리 담당

---

## ⚙️ 필요한 기능

### 주요 기능
- 기본 제목 자동 생성 (마지막 선택 부위명 기반)
- 제목 입력 및 유효성 검사
- 루틴 데이터 저장 처리
- 저장 완료 후 프리셋 선택 화면으로 라우팅
- 모달 외부 클릭 또는 ESC 키로 취소 가능
- 운동 상세 입력 화면에서 루틴 완료 시 이 화면으로 라우팅

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

---

## 🧪 테스트 계획

### Unit Tests (`RoutineTitleView.test.tsx`)
- [ ] 모달이 올바르게 렌더링되는지 확인
- [ ] 기본 제목이 입력 필드에 표시되는지 확인
- [ ] 제목 변경 시 상태가 업데이트되는지 확인
- [ ] 유효하지 않은 입력 시 에러 메시지 표시
- [ ] 키보드 이벤트 처리 (Enter, ESC)

### Unit Tests (`RoutineTitle.test.tsx`)
- [ ] 기본 제목 생성 로직 테스트
- [ ] 제목 유효성 검사 테스트
- [ ] 루틴 저장 시 콘솔에 로그 출력
- [ ] 저장 성공 시 프리셋 선택 화면으로 라우팅

---

## 📚 스토리북 계획

### Stories (`RoutineTitleView.stories.tsx`)
- [ ] Default: 기본 상태의 모달
- [ ] WithDefaultTitle: 기본 제목이 설정된 상태
- [ ] WithError: 유효성 검사 에러가 있는 상태
- [ ] EmptyState: 빈 제목으로 시작하는 상태

### Stories (`RoutineTitle.stories.tsx`)
- [ ] Default: 기본 루틴 제목 입력 화면 (라우터 컨텍스트 포함)

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 구조 정의
- [ ] 루틴 제목 관련 타입 정의
- [ ] 유효성 검사 규칙 정의
- [ ] 기본 제목 생성 로직 정의

### 2단계: Presentational Component 구현
- [ ] `RoutineTitleView` 컴포넌트 구현 (모달, 입력 필드, 버튼 포함)

### 3단계: 테스트 작성
- [ ] `RoutineTitleView` 단위 테스트 작성
- [ ] 접근성 테스트 포함

### 4단계: 스토리북 설정
- [ ] `RoutineTitleView` 스토리 작성
- [ ] `RoutineTitle` 스토리 작성

### 5단계: Controller Component 구현
- [ ] `RoutineTitle` 구현
- [ ] 폼 상태 관리 로직 구현
- [ ] 루틴 저장 및 라우팅 로직 구현

### 6단계: 통합 테스트
- [ ] `RoutineTitle` 컴포넌트 테스트 작성

### 7단계: 스타일링 및 UX 개선
- [ ] 모달 애니메이션 및 레이아웃 구현
- [ ] 호버 및 포커스 상태 스타일링
- [ ] 접근성 개선 (키보드 네비게이션, 스크린 리더 지원)

### 8단계: 라우팅 연결
- [ ] App.tsx에 루틴 제목 입력 화면 라우트 추가
- [ ] 운동 상세 입력 화면에서 루틴 완료 시 이 화면으로 라우팅 연결

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅
- CSS Grid 또는 Flexbox for 레이아웃

### 파일 구조
```
src/
  pages/
    routine-title/
      RoutineTitleView.tsx
      RoutineTitleView.test.tsx
      RoutineTitleView.stories.tsx
      RoutineTitle.tsx
      RoutineTitle.test.tsx
      RoutineTitle.stories.tsx
      index.ts
```

### Clean Architecture 적용
- **Presentation Layer**: `RoutineTitleView` - UI 표시만 담당
- **Application Layer**: `RoutineTitle` - 비즈니스 로직 및 라우팅 담당

### 접근성 고려사항
- 모달에 적절한 role 및 aria 속성 설정
- 포커스 트랩핑 (모달 내에서만 포커스 이동)
- ESC 키로 모달 닫기 지원
- 스크린 리더를 위한 라벨 및 설명 제공
- 키보드만으로 모든 기능 사용 가능

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 폼 상태의 메모이제이션

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 기본 제목이 자동으로 생성되어 표시
- [ ] 제목 유효성 검사 및 에러 처리 완료
- [ ] 루틴 저장 시 콘솔에 로그 출력
- [ ] 저장 성공 시 프리셋 선택 화면으로 정상 이동
- [ ] 모달 애니메이션 및 UX 구현 완료
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 키보드 네비게이션 완전 지원
- [ ] 운동 상세 입력 화면에서 루틴 완료 시 이 화면으로 정상 이동 