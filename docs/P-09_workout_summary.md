# 개발 계획서: P-09 오늘의 운동 기록 요약 화면

---

## 📌 개발 목표

- 사용자가 완료한 운동 내역을 체계적이고 가독성 있게 표시
- 오늘 완료한 모든 운동 세션에 대한 종합적인 요약 제공
- 운동 성과를 명확하게 보여주어 동기부여와 성취감 증진
- 향후 운동 계획 수립에 도움이 되는 정보 제공

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `WorkoutSummaryView`: 운동 요약 화면 전체 레이아웃
- `DailySummaryHeader`: 날짜 및 전체 요약 정보 헤더
- `ExerciseList`: 운동 목록 표시 컴포넌트
- `ExerciseItem`: 개별 운동 항목 컴포넌트
- `SummaryStats`: 전체 통계 정보 카드
- `NoWorkoutMessage`: 운동 기록이 없을 때 표시되는 메시지

### Container Components
- `WorkoutSummaryContainer`: 데이터 조회 및 계산 로직 담당

---

## ⚙️ 필요한 기능 및 상태 관리

### 상태 관리
- 선택된 날짜의 운동 기록
- 요약 통계 데이터
- 로딩 상태
- 에러 상태

### 주요 기능
- 오늘 날짜의 모든 운동 세션 조회
- 운동별 세트 수, 중량, 시간 집계
- 전체 운동 시간 및 소모 칼로리 계산
- 운동 타입별 분류 및 표시
- 날짜 선택 기능 (향후 확장)

### 데이터 모델
```typescript
interface DailyWorkoutSummary {
  date: Date;
  totalSessions: number;
  totalDuration: number; // 분
  totalExercises: number;
  totalSets: number;
  totalWeight?: number; // kg
  totalCardioTime?: number; // 분
  estimatedCalories?: number;
  exercises: ExerciseSummary[];
}

interface ExerciseSummary {
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  type: 'weight' | 'cardio';
  totalSets: number;
  totalWeight?: number;
  totalDuration?: number;
  avgWeight?: number;
  maxWeight?: number;
  sessions: string[]; // 세션 ID 목록
}

interface WorkoutDisplayFormat {
  weight: {
    format: (exercise: ExerciseSummary) => string;
    // 예: "가슴 - 벤치프레스 - 3세트"
  };
  cardio: {
    format: (exercise: ExerciseSummary) => string;
    // 예: "유산소 - 러닝머신 - 30분"
  };
}

interface SummaryStatistics {
  workoutFrequency: number; // 이번 주 운동 횟수
  weeklyProgress: number; // 주간 진행률 (%)
  favoriteBodyPart: string; // 가장 많이 한 부위
  strongestLift?: { exercise: string; weight: number };
  longestCardio?: { exercise: string; duration: number };
}
```

---

## 🧪 테스트 계획

### Unit Tests (`WorkoutSummaryView.test.tsx`)
- [ ] 운동 기록이 있을 때 올바르게 표시
- [ ] 운동 기록이 없을 때 빈 상태 메시지 표시
- [ ] 날짜가 올바르게 표시되는지 확인
- [ ] 통계 정보가 정확하게 표시

### Unit Tests (`ExerciseItem.test.tsx`)
- [ ] 웨이트 운동 형식이 올바르게 표시
- [ ] 유산소 운동 형식이 올바르게 표시
- [ ] 운동명과 부위가 정확하게 표시
- [ ] 세트/시간 정보가 올바르게 포맷팅

### Unit Tests (`SummaryStats.test.tsx`)
- [ ] 전체 운동 시간이 올바르게 계산되어 표시
- [ ] 총 세트 수가 정확하게 집계
- [ ] 소모 칼로리가 적절하게 추정되어 표시
- [ ] 빈 데이터일 때 적절한 기본값 표시

### Integration Tests (`WorkoutSummaryContainer.test.tsx`)
- [ ] 날짜별 운동 데이터 조회가 올바르게 수행
- [ ] 운동 데이터 집계 계산이 정확히 실행
- [ ] 다양한 운동 타입에 대한 포맷팅 테스트
- [ ] 에러 상태 처리 테스트

---

## 📚 스토리북 계획

### Stories (`WorkoutSummaryView.stories.tsx`)
- [ ] FullDay: 다양한 운동이 포함된 풍부한 데이터
- [ ] WeightOnly: 웨이트 운동만 있는 날
- [ ] CardioOnly: 유산소 운동만 있는 날
- [ ] MixedWorkout: 웨이트와 유산소가 혼합된 날
- [ ] SingleExercise: 한 가지 운동만 한 날
- [ ] EmptyState: 운동 기록이 없는 날

### Stories (`ExerciseItem.stories.tsx`)
- [ ] WeightExercise: 웨이트 운동 항목
- [ ] CardioExercise: 유산소 운동 항목
- [ ] HighVolume: 많은 세트의 운동 항목
- [ ] LongDuration: 긴 시간의 유산소 항목

### Stories (`SummaryStats.stories.tsx`)
- [ ] ActiveDay: 활발한 운동 일의 통계
- [ ] LightDay: 가벼운 운동 일의 통계
- [ ] FirstTime: 첫 운동 기록의 통계

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 집계 및 계산 로직
- [ ] 운동 데이터 집계 함수 구현
- [ ] 통계 계산 유틸리티 함수 작성
- [ ] 운동 타입별 포맷팅 함수 구현
- [ ] 칼로리 추정 알고리즘 구현

### 2단계: 표시 컴포넌트 구현
- [ ] `ExerciseItem` 컴포넌트 구현
- [ ] `SummaryStats` 컴포넌트 구현
- [ ] `DailySummaryHeader` 컴포넌트 구현
- [ ] 운동 타입별 다른 표시 형식 구현

### 3단계: 테스트 작성
- [ ] 데이터 집계 로직 테스트 작성
- [ ] 컴포넌트 단위 테스트 작성
- [ ] 포맷팅 함수 테스트 작성
- [ ] 통계 계산 테스트 작성

### 4단계: 스토리북 설정
- [ ] 다양한 데이터 패턴의 스토리 작성
- [ ] 빈 상태 및 에러 상태 스토리
- [ ] 인터랙션 테스트 추가

### 5단계: 데이터 서비스 구현
- [ ] 날짜별 운동 기록 조회 서비스
- [ ] 데이터 캐싱 및 성능 최적화
- [ ] 에러 처리 및 재시도 로직

### 6단계: Container Component 구현
- [ ] `WorkoutSummaryContainer` 구현
- [ ] 데이터 로딩 및 상태 관리
- [ ] 에러 상태 처리 구현

### 7단계: 전체 화면 구성
- [ ] `WorkoutSummaryView` 전체 레이아웃 구현
- [ ] 반응형 디자인 적용
- [ ] 로딩 상태 및 빈 상태 처리

### 8단계: 고급 기능 및 최적화
- [ ] 날짜 선택 기능 (캘린더 위젯)
- [ ] 주간/월간 요약 보기 (선택적)
- [ ] 데이터 내보내기 기능 (CSV, PDF)
- [ ] 성능 최적화 및 메모이제이션

---

## 🔧 기술적 고려사항

### 의존성
- 날짜 처리 라이브러리 (date-fns, dayjs)
- 데이터 집계를 위한 유틸리티 (lodash 일부 함수)
- 차트 라이브러리 (향후 시각화를 위해 - recharts, chart.js)

### 파일 구조
```
src/
  pages/
    workout-summary/
      components/
        WorkoutSummaryView.tsx
        WorkoutSummaryView.test.tsx
        WorkoutSummaryView.stories.tsx
        DailySummaryHeader.tsx
        ExerciseList.tsx
        ExerciseItem.tsx
        ExerciseItem.test.tsx
        ExerciseItem.stories.tsx
        SummaryStats.tsx
        SummaryStats.test.tsx
        SummaryStats.stories.tsx
        NoWorkoutMessage.tsx
      containers/
        WorkoutSummaryContainer.tsx
        WorkoutSummaryContainer.test.tsx
      services/
        workoutSummaryService.ts
        workoutSummaryService.test.ts
      utils/
        exerciseAggregator.ts
        exerciseAggregator.test.ts
        formatters.ts
        formatters.test.ts
        calorieCalculator.ts
        statisticsCalculator.ts
      index.ts
```

### 데이터 집계 로직
```typescript
const aggregateExercisesByDay = (
  workoutSessions: WorkoutSession[],
  targetDate: Date
): DailyWorkoutSummary => {
  const dayStart = startOfDay(targetDate);
  const dayEnd = endOfDay(targetDate);
  
  const dailySessions = workoutSessions.filter(session =>
    isWithinInterval(session.completedAt, { start: dayStart, end: dayEnd })
  );

  const exerciseMap = new Map<string, ExerciseSummary>();
  let totalDuration = 0;
  let totalSets = 0;
  let totalWeight = 0;
  let totalCardioTime = 0;

  dailySessions.forEach(session => {
    totalDuration += session.duration;
    
    session.exercises.forEach(exercise => {
      const key = `${exercise.exerciseId}-${exercise.bodyPart}`;
      const existing = exerciseMap.get(key) || {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        bodyPart: exercise.bodyPart,
        type: exercise.bodyPart === 'cardio' ? 'cardio' : 'weight',
        totalSets: 0,
        totalWeight: 0,
        totalDuration: 0,
        sessions: []
      };

      existing.totalSets += exercise.sets.length;
      existing.sessions.push(session.id);
      
      if (existing.type === 'weight') {
        const exerciseWeight = exercise.sets.reduce((sum, set) => 
          sum + (set.weight * set.reps), 0);
        existing.totalWeight += exerciseWeight;
        totalWeight += exerciseWeight;
        totalSets += exercise.sets.length;
      } else {
        const exerciseDuration = exercise.sets.reduce((sum, set) => 
          sum + set.duration, 0);
        existing.totalDuration += exerciseDuration;
        totalCardioTime += exerciseDuration;
      }

      exerciseMap.set(key, existing);
    });
  });

  return {
    date: targetDate,
    totalSessions: dailySessions.length,
    totalDuration,
    totalExercises: exerciseMap.size,
    totalSets,
    totalWeight: totalWeight > 0 ? totalWeight : undefined,
    totalCardioTime: totalCardioTime > 0 ? totalCardioTime : undefined,
    estimatedCalories: estimateCaloriesBurned(totalWeight, totalCardioTime, totalDuration),
    exercises: Array.from(exerciseMap.values())
  };
};
```

### 표시 형식 정의
```typescript
const EXERCISE_FORMATTERS: WorkoutDisplayFormat = {
  weight: {
    format: (exercise: ExerciseSummary) => 
      `${exercise.bodyPart} - ${exercise.exerciseName} - ${exercise.totalSets}세트`
  },
  cardio: {
    format: (exercise: ExerciseSummary) => 
      `유산소 - ${exercise.exerciseName} - ${exercise.totalDuration}분`
  }
};
```

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 데이터 집계 결과 메모이제이션
- 날짜별 데이터 캐싱 구현

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 웨이트 운동과 유산소 운동이 올바른 형식으로 표시
- [ ] 전체 통계 정보가 정확하게 계산되어 표시
- [ ] 운동 기록이 없을 때 적절한 메시지 표시
- [ ] 날짜별 데이터 조회가 정확하게 수행
- [ ] 반응형 디자인 구현 완료
- [ ] 접근성 기준 충족
- [ ] 데이터 로딩 및 에러 상태 적절히 처리
- [ ] 직관적이고 읽기 쉬운 요약 정보 제공 