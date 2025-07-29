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
- `WorkoutView`: 운동 진행 화면 전체 레이아웃
- `ExerciseInfo`: 현재 운동 정보 표시 컴포넌트
- `SetProgress`: 세트 진행 상황 표시 컴포넌트
- `RestTimer`: 휴식 타이머 컴포넌트
- `SetCompleteButton`: 세트 완료 버튼 컴포넌트
- `WorkoutControls`: 운동 제어 버튼들 (그만두기, 휴식 건너뛰기)

### Container Components
- `WorkoutContainer`: 운동 진행 로직 및 상태 관리 담당

---

## ⚙️ 필요한 기능 및 상태 관리

### 상태 관리
- 현재 운동 정보 (선택된 프리셋 또는 생성된 루틴)
- 현재 운동 인덱스 및 세트 진행 상황
- 휴식 타이머 상태 (시간, 실행 여부)
- 운동 진행 모드 (세트 중, 휴식 중, 완료)
- 세션 시작 시간 및 경과 시간

### 주요 기능
- 세트 완료 처리 및 다음 세트/운동으로 진행
- 휴식 타이머 자동 시작 및 카운트다운
- 휴식 건너뛰기 및 시간 조정 기능
- 운동 중단 및 세션 종료 처리
- 진행 상황 저장 및 복원 (세션 유지)

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
```

---

## 🧪 테스트 계획

### Unit Tests (`WorkoutView.test.tsx`)
- [ ] 운동 정보가 올바르게 표시되는지 확인
- [ ] 세트 진행 상황이 정확하게 표시
- [ ] 세트 완료 버튼이 올바르게 렌더링
- [ ] 휴식 중 타이머가 표시되는지 확인

### Unit Tests (`RestTimer.test.tsx`)
- [ ] 타이머가 올바른 시간으로 시작
- [ ] 카운트다운이 정확하게 동작
- [ ] 타이머 완료 시 콜백 함수 호출
- [ ] 일시정지 및 재시작 기능
- [ ] 시간 포맷팅이 올바르게 표시

### Unit Tests (`SetProgress.test.tsx`)
- [ ] 현재 세트 정보가 올바르게 표시
- [ ] 진행률 바가 정확하게 표시
- [ ] 완료된 세트 표시 업데이트

### Integration Tests (`WorkoutContainer.test.tsx`)
- [ ] 세트 완료 시 상태 업데이트
- [ ] 휴식 타이머 자동 시작
- [ ] 운동 완료 시 다음 운동으로 진행
- [ ] 모든 운동 완료 시 완료 화면으로 이동
- [ ] 운동 중단 시 데이터 저장

---

## 📚 스토리북 계획

### Stories (`WorkoutView.stories.tsx`)
- [ ] ActiveSet: 세트 진행 중 상태
- [ ] RestPeriod: 휴식 중 상태
- [ ] FirstSet: 첫 번째 세트 시작 상태
- [ ] LastSet: 마지막 세트 진행 상태
- [ ] WeightExercise: 웨이트 운동 진행 상태
- [ ] CardioExercise: 유산소 운동 진행 상태

### Stories (`RestTimer.stories.tsx`)
- [ ] Default: 기본 타이머 (60초)
- [ ] ShortRest: 짧은 휴식 (30초)
- [ ] LongRest: 긴 휴식 (180초)
- [ ] AlmostComplete: 거의 완료된 타이머 (5초 남음)
- [ ] Paused: 일시정지된 타이머

### Stories (`SetProgress.stories.tsx`)
- [ ] FirstSet: 첫 번째 세트
- [ ] MiddleSet: 중간 세트
- [ ] LastSet: 마지막 세트
- [ ] MultipleExercises: 여러 운동이 있는 경우

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 타이머 컴포넌트 구현
- [ ] `RestTimer` 컴포넌트 구현
- [ ] 카운트다운 로직 구현
- [ ] 타이머 제어 기능 (시작, 일시정지, 재시작, 리셋)
- [ ] 타이머 완료 알림 기능

### 2단계: 진행 상황 표시 컴포넌트
- [ ] `ExerciseInfo` 컴포넌트 구현
- [ ] `SetProgress` 컴포넌트 구현
- [ ] 진행률 계산 로직 구현
- [ ] 시각적 진행 표시 (프로그레스 바 등)

### 3단계: 테스트 작성
- [ ] `RestTimer` 단위 테스트 작성
- [ ] `SetProgress` 단위 테스트 작성
- [ ] `ExerciseInfo` 단위 테스트 작성
- [ ] 타이머 로직 테스트

### 4단계: 스토리북 설정
- [ ] `RestTimer` 스토리 작성
- [ ] `WorkoutView` 스토리 작성
- [ ] 다양한 운동 상태의 스토리 구현
- [ ] 인터랙션 테스트 추가

### 5단계: 운동 세션 상태 관리
- [ ] 운동 세션 상태 관리 훅 구현
- [ ] 세트 완료 로직 구현
- [ ] 운동 진행 상태 추적
- [ ] 세션 데이터 지속성 (새로고침 시 복원)

### 6단계: Container Component 구현
- [ ] `WorkoutContainer` 구현
- [ ] 운동 플로우 제어 로직
- [ ] 휴식 타이머 관리 로직
- [ ] 운동 완료 및 중단 처리

### 7단계: 전체 화면 구성
- [ ] `WorkoutView` 전체 레이아웃 구현
- [ ] 제어 버튼 영역 구현
- [ ] 반응형 디자인 적용
- [ ] 세트/휴식 상태별 UI 전환

### 8단계: 고급 기능 및 최적화
- [ ] 백그라운드 타이머 지원 (앱 최소화 시)
- [ ] 진동 및 사운드 알림 (선택적)
- [ ] 운동 기록 로깅
- [ ] 성능 최적화 및 메모리 관리

---

## 🔧 기술적 고려사항

### 의존성
- 타이머 관리를 위한 useInterval 훅
- 백그라운드 상태 감지 (Page Visibility API)
- 로컬 스토리지 또는 IndexedDB (세션 저장)
- Web Audio API 또는 Vibration API (알림)

### 파일 구조
```
src/
  pages/
    workout/
      components/
        WorkoutView.tsx
        WorkoutView.test.tsx
        WorkoutView.stories.tsx
        ExerciseInfo.tsx
        SetProgress.tsx
        RestTimer.tsx
        RestTimer.test.tsx
        RestTimer.stories.tsx
        SetCompleteButton.tsx
        WorkoutControls.tsx
      containers/
        WorkoutContainer.tsx
        WorkoutContainer.test.tsx
      hooks/
        useWorkoutSession.ts
        useWorkoutSession.test.ts
        useTimer.ts
        useTimer.test.ts
      services/
        workoutSessionService.ts
        workoutSessionService.test.ts
      utils/
        timeUtils.ts
        progressCalculator.ts
      index.ts
```

### 타이머 구현
```typescript
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

### 백그라운드 처리
- Page Visibility API를 사용하여 앱이 백그라운드로 갈 때 타이머 상태 저장
- 앱이 다시 포그라운드로 올 때 경과 시간 계산하여 타이머 업데이트
- 세션 데이터를 로컬 스토리지에 주기적으로 저장

### 접근성 고려사항
- 타이머 시간 변화를 스크린 리더에 적절히 알림
- 운동 진행 상황을 음성으로 안내
- 큰 터치 영역의 버튼 제공
- 키보드 네비게이션 지원

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 세트 완료 시 자동으로 휴식 타이머 시작
- [ ] 휴식 완료 시 다음 세트로 자동 진행
- [ ] 모든 운동 완료 시 완료 화면으로 이동
- [ ] 운동 중단 시 진행 상황 저장
- [ ] 백그라운드에서도 타이머 정상 동작
- [ ] 반응형 디자인 구현
- [ ] 접근성 기준 충족
- [ ] 직관적이고 사용하기 쉬운 인터페이스
- [ ] 세션 복원 기능 (새로고침 시) 