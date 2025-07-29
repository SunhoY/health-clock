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
- `WorkoutSummaryView`: 운동 요약 화면 전체 레이아웃 (헤더, 운동 목록, 통계 포함)

### Controller Components
- `WorkoutSummary`: 데이터 조회 및 계산 로직 담당

---

## ⚙️ 필요한 기능

### 주요 기능
- 오늘 날짜의 모든 운동 세션 조회
- 운동별 세트 수, 중량, 시간 집계
- 전체 운동 시간 및 소모 칼로리 계산
- 운동 타입별 분류 및 표시
- 날짜 선택 기능 (향후 확장)
- 운동 완료 화면에서 요약 보기 버튼 클릭 시 이 화면으로 라우팅

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

---

## 🧪 테스트 계획

### Unit Tests (`WorkoutSummaryView.test.tsx`)
- [ ] 운동 기록이 있을 때 올바르게 표시
- [ ] 운동 기록이 없을 때 빈 상태 메시지 표시
- [ ] 날짜가 올바르게 표시되는지 확인
- [ ] 통계 정보가 정확하게 표시
- [ ] 웨이트 운동과 유산소 운동이 올바른 형식으로 표시

### Unit Tests (`WorkoutSummary.test.tsx`)
- [ ] 날짜별 운동 데이터 조회 시 콘솔에 로그 출력
- [ ] 운동 데이터 집계 계산 시 콘솔에 로그 출력
- [ ] 다양한 운동 타입에 대한 포맷팅 테스트
- [ ] 빈 데이터 처리 테스트

---

## 📚 스토리북 계획

### Stories (`WorkoutSummaryView.stories.tsx`)
- [ ] FullDay: 다양한 운동이 포함된 풍부한 데이터
- [ ] WeightOnly: 웨이트 운동만 있는 날
- [ ] CardioOnly: 유산소 운동만 있는 날
- [ ] MixedWorkout: 웨이트와 유산소가 혼합된 날
- [ ] SingleExercise: 한 가지 운동만 한 날
- [ ] EmptyState: 운동 기록이 없는 날

### Stories (`WorkoutSummary.stories.tsx`)
- [ ] Default: 기본 운동 요약 화면 (라우터 컨텍스트 포함)

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 구조 정의
- [ ] 운동 요약 데이터 타입 정의
- [ ] 통계 계산 로직 정의
- [ ] 운동 타입별 포맷팅 함수 정의

### 2단계: Presentational Component 구현
- [ ] `WorkoutSummaryView` 컴포넌트 구현 (헤더, 운동 목록, 통계 포함)

### 3단계: 테스트 작성
- [ ] `WorkoutSummaryView` 단위 테스트 작성
- [ ] 접근성 테스트 포함

### 4단계: 스토리북 설정
- [ ] `WorkoutSummaryView` 스토리 작성
- [ ] `WorkoutSummary` 스토리 작성

### 5단계: Controller Component 구현
- [ ] `WorkoutSummary` 구현
- [ ] 데이터 조회 및 집계 로직 구현
- [ ] 라우팅 로직 구현

### 6단계: 통합 테스트
- [ ] `WorkoutSummary` 컴포넌트 테스트 작성

### 7단계: 스타일링 및 UX 개선
- [ ] 반응형 요약 레이아웃 구현
- [ ] 호버 및 포커스 상태 스타일링
- [ ] 접근성 개선 (키보드 네비게이션, 스크린 리더 지원)

### 8단계: 라우팅 연결
- [ ] App.tsx에 운동 요약 화면 라우트 추가
- [ ] 운동 완료 화면에서 요약 보기 버튼 클릭 시 이 화면으로 라우팅 연결

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅
- CSS Grid 또는 Flexbox for 레이아웃

### 파일 구조
```
src/
  pages/
    workout-summary/
      WorkoutSummaryView.tsx
      WorkoutSummaryView.test.tsx
      WorkoutSummaryView.stories.tsx
      WorkoutSummary.tsx
      WorkoutSummary.test.tsx
      WorkoutSummary.stories.tsx
      index.ts
```

### Clean Architecture 적용
- **Presentation Layer**: `WorkoutSummaryView` - UI 표시만 담당
- **Application Layer**: `WorkoutSummary` - 비즈니스 로직 및 라우팅 담당

### 접근성 고려사항
- 운동 목록을 스크린 리더가 읽을 수 있도록 적절한 ARIA 설정
- 통계 정보를 표 형태로 구조화하여 접근성 향상
- 키보드 네비게이션으로 모든 요소 접근 가능
- 색상만으로 정보를 전달하지 않도록 주의

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 데이터 집계 결과의 메모이제이션

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 웨이트 운동과 유산소 운동이 올바른 형식으로 표시
- [ ] 전체 통계 정보가 정확하게 계산되어 표시
- [ ] 운동 기록이 없을 때 적절한 메시지 표시
- [ ] 날짜별 데이터 조회 시 콘솔에 로그 출력
- [ ] 운동 데이터 집계 계산 시 콘솔에 로그 출력
- [ ] 반응형 디자인 구현 완료
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 직관적이고 읽기 쉬운 요약 정보 제공
- [ ] 운동 완료 화면에서 요약 보기 버튼 클릭 시 이 화면으로 정상 이동 