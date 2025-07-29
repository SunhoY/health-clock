# 개발 계획서: P-07 운동 진행 화면

---

## 📌 개발 목표

- 사용자가 선택한 운동을 세트 단위로 수행할 수 있는 직관적인 인터페이스 구현
- 세트 간 휴식 시간을 자동으로 관리하는 타이머 기능 제공
- 운동 진행 상황을 명확하게 표시하고 효율적인 플로우 제어
- 운동 중단 및 재시작 기능을 통한 유연한 사용자 경험 제공

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `WorkoutView`: 운동 진행 화면 전체 레이아웃 (운동 정보, 세트 진행, 타이머, 버튼 포함)

### Controller Components
- `Workout`: 운동 진행 로직 및 상태 관리 담당

---

## ⚙️ 필요한 기능

### 주요 기능
- 세트 완료 처리 및 다음 세트/운동으로 진행
- 휴식 타이머 자동 시작 및 카운트다운
- 휴식 건너뛰기 및 시간 조정 기능
- 운동 중단 및 세션 종료 처리
- 프리셋 선택 화면에서 프리셋 선택 시 이 화면으로 라우팅

### 데이터 모델
```typescript
interface WorkoutSession {
  id: string;
  presetId?: string;
  exercises: ExerciseDetail[];
  currentExerciseIndex: number;
  currentSet: number;
  startTime: Date;
  pausedTime?: number;
  completedSets: CompletedSet[];
  status: 'active' | 'paused' | 'completed' | 'abandoned';
}

interface CompletedSet {
  exerciseId: string;
  setNumber: number;
  weight?: number;
  reps?: number;
  duration?: number;
  restTime: number;
  completedAt: Date;
}

interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  totalTime: number;
  isPaused: boolean;
}

interface WorkoutProgress {
  currentExercise: ExerciseDetail;
  totalExercises: number;
  currentExerciseIndex: number;
  currentSet: number;
  totalSets: number;
  percentComplete: number;
}

// 타이머 훅 구현
const useTimer = (initialTime: number, onComplete?: () => void) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime?: number) => {
    setIsRunning(false);
    setTimeRemaining(newTime ?? initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeRemaining, onComplete]);

  return { timeRemaining, isRunning, start, pause, reset };
};
```

---

## 🧪 테스트 계획

### Unit Tests (`WorkoutView.test.tsx`)
- [ ] 운동 정보가 올바르게 표시되는지 확인
- [ ] 세트 진행 상황이 정확하게 표시
- [ ] 세트 완료 버튼이 올바르게 렌더링
- [ ] 휴식 중 타이머가 표시되는지 확인
- [ ] 타이머 카운트다운이 정확하게 동작

### Unit Tests (`Workout.test.tsx`)
- [ ] 세트 완료 시 상태 업데이트
- [ ] 휴식 타이머 자동 시작
- [ ] 운동 완료 시 콘솔에 로그 출력
- [ ] 모든 운동 완료 시 완료 화면으로 라우팅
- [ ] 운동 중단 시 콘솔에 로그 출력

---

## 📚 스토리북 계획

### Stories (`WorkoutView.stories.tsx`)
- [ ] ActiveSet: 세트 진행 중 상태
- [ ] RestPeriod: 휴식 중 상태
- [ ] FirstSet: 첫 번째 세트 시작 상태
- [ ] LastSet: 마지막 세트 진행 상태
- [ ] WeightExercise: 웨이트 운동 진행 상태
- [ ] CardioExercise: 유산소 운동 진행 상태

### Stories (`Workout.stories.tsx`)
- [ ] Default: 기본 운동 진행 화면 (라우터 컨텍스트 포함)

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 구조 정의
- [ ] 운동 세션 관련 타입 정의
- [ ] 타이머 상태 타입 정의
- [ ] 진행 상황 계산 로직 정의

### 2단계: Presentational Component 구현
- [ ] `WorkoutView` 컴포넌트 구현 (운동 정보, 세트 진행, 타이머, 버튼 포함)

### 3단계: 테스트 작성
- [ ] `WorkoutView` 단위 테스트 작성
- [ ] 접근성 테스트 포함

### 4단계: 스토리북 설정
- [ ] `WorkoutView` 스토리 작성
- [ ] `Workout` 스토리 작성

### 5단계: Controller Component 구현
- [ ] `Workout` 구현
- [ ] 운동 세션 상태 관리 로직 구현
- [ ] 타이머 관리 로직 구현
- [ ] 세트 완료 및 운동 진행 로직 구현

### 6단계: 통합 테스트
- [ ] `Workout` 컴포넌트 테스트 작성

### 7단계: 스타일링 및 UX 개선
- [ ] 반응형 운동 진행 레이아웃 구현
- [ ] 호버 및 포커스 상태 스타일링
- [ ] 타이머 애니메이션 효과 추가
- [ ] 접근성 개선 (키보드 네비게이션, 스크린 리더 지원)

### 8단계: 라우팅 연결
- [ ] App.tsx에 운동 진행 화면 라우트 추가
- [ ] 프리셋 선택 화면에서 프리셋 선택 시 이 화면으로 라우팅 연결

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅
- CSS Grid 또는 Flexbox for 레이아웃

### 파일 구조
```
src/
  pages/
    workout/
      WorkoutView.tsx
      WorkoutView.test.tsx
      WorkoutView.stories.tsx
      Workout.tsx
      Workout.test.tsx
      Workout.stories.tsx
      index.ts
```

### Clean Architecture 적용
- **Presentation Layer**: `WorkoutView` - UI 표시만 담당
- **Application Layer**: `Workout` - 비즈니스 로직 및 라우팅 담당

### 접근성 고려사항
- 타이머 시간 변화를 스크린 리더에 적절히 알림
- 운동 진행 상황을 음성으로 안내
- 큰 터치 영역의 버튼 제공
- 키보드 네비게이션 지원

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 타이머 상태의 메모이제이션

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 세트 완료 시 자동으로 휴식 타이머 시작
- [ ] 휴식 완료 시 다음 세트로 자동 진행
- [ ] 운동 완료 시 콘솔에 로그 출력
- [ ] 모든 운동 완료 시 완료 화면으로 라우팅
- [ ] 운동 중단 시 콘솔에 로그 출력
- [ ] 반응형 디자인 구현
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 직관적이고 사용하기 쉬운 인터페이스
- [ ] 프리셋 선택 화면에서 프리셋 선택 시 이 화면으로 정상 이동 