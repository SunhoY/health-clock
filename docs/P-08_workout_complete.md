# 개발 계획서: P-08 운동 완료 화면

---

## 📌 개발 목표

- 운동 세션 완료 시 사용자에게 성취감을 주는 축하 화면 구현
- 완료된 운동에 대한 간단한 피드백 및 격려 메시지 제공
- 다음 액션으로의 명확한 진입점 제공 (요약 보기 또는 추가 운동)
- 운동 완료 데이터 저장 및 통계 업데이트

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `WorkoutCompleteView`: 운동 완료 화면 전체 레이아웃
- `CelebrationMessage`: 축하 메시지 표시 컴포넌트
- `WorkoutSummaryCard`: 완료된 운동 간단 요약 카드
- `ActionButtons`: 다음 액션 버튼들 (운동 마치기, 다른 운동하기)
- `AchievementBadge`: 성취 배지 표시 컴포넌트 (선택적)

### Container Components
- `WorkoutCompleteContainer`: 완료 데이터 처리 및 라우팅 로직 담당

---

## ⚙️ 필요한 기능 및 상태 관리

### 상태 관리
- 완료된 운동 세션 데이터
- 축하 메시지 (랜덤 선택)
- 통계 데이터 업데이트 상태
- 다음 액션 선택 상태

### 주요 기능
- 랜덤 축하 메시지 표시
- 운동 세션 데이터 최종 저장
- 사용자 운동 통계 업데이트
- 요약 화면 또는 추가 운동으로 라우팅
- 성취 배지 시스템 (연속 운동 일수, 목표 달성 등)

### 데이터 모델
```typescript
interface WorkoutCompletionData {
  sessionId: string;
  completedAt: Date;
  duration: number; // 전체 운동 시간 (분)
  exercises: CompletedExercise[];
  totalSets: number;
  totalWeight?: number; // 총 중량 (kg)
  totalCardioTime?: number; // 총 유산소 시간 (분)
  caloriesBurned?: number; // 추정 소모 칼로리
}

interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  sets: CompletedSet[];
  totalWeight?: number;
  totalDuration?: number;
}

interface CelebrationMessage {
  id: string;
  message: string;
  emoji: string;
  category: 'general' | 'strength' | 'cardio' | 'consistency';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'streak' | 'volume' | 'frequency' | 'personal_best';
}

const CELEBRATION_MESSAGES: CelebrationMessage[] = [
  { id: '1', message: '와! 오늘도 완벽하게 해냈어요', emoji: '💪', category: 'general' },
  { id: '2', message: '몸이 기억할 거예요, 이 노력!', emoji: '✨', category: 'general' },
  { id: '3', message: '하루 한 걸음, 멋진 당신의 루틴!', emoji: '🏃‍♂️', category: 'consistency' },
  { id: '4', message: '대단해요! 자신과의 약속을 지켰어요.', emoji: '🎉', category: 'general' },
  { id: '5', message: '운동 완료! 이젠 쉬어도 좋아요', emoji: '😊', category: 'general' }
];
```

---

## 🧪 테스트 계획

### Unit Tests (`WorkoutCompleteView.test.tsx`)
- [ ] 축하 메시지가 올바르게 표시되는지 확인
- [ ] 운동 요약 정보가 정확하게 표시
- [ ] 액션 버튼들이 올바르게 렌더링
- [ ] 성취 배지가 조건에 맞게 표시

### Unit Tests (`CelebrationMessage.test.tsx`)
- [ ] 랜덤 메시지가 올바르게 선택되어 표시
- [ ] 이모지가 함께 표시되는지 확인
- [ ] 애니메이션 효과가 적용되는지 확인

### Unit Tests (`WorkoutSummaryCard.test.tsx`)
- [ ] 운동 시간이 올바르게 포맷되어 표시
- [ ] 완료된 운동 수와 세트 수가 정확히 표시
- [ ] 웨이트/유산소에 따른 다른 정보 표시

### Integration Tests (`WorkoutCompleteContainer.test.tsx`)
- [ ] 운동 데이터 저장이 올바르게 수행
- [ ] 통계 업데이트가 정확하게 실행
- [ ] 성취 조건 검사 및 배지 부여
- [ ] 라우팅이 선택한 액션에 따라 올바르게 실행

---

## 📚 스토리북 계획

### Stories (`WorkoutCompleteView.stories.tsx`)
- [ ] StrengthWorkout: 웨이트 운동 완료 상태
- [ ] CardioWorkout: 유산소 운동 완료 상태
- [ ] MixedWorkout: 복합 운동 완료 상태
- [ ] WithAchievement: 성취 배지가 있는 상태
- [ ] FirstWorkout: 첫 운동 완료 상태
- [ ] StreakAchievement: 연속 운동 달성 상태

### Stories (`CelebrationMessage.stories.tsx`)
- [ ] GeneralMessage: 일반적인 축하 메시지
- [ ] StrengthMessage: 근력 운동 관련 메시지
- [ ] CardioMessage: 유산소 운동 관련 메시지
- [ ] ConsistencyMessage: 꾸준함 관련 메시지

### Stories (`AchievementBadge.stories.tsx`)
- [ ] StreakBadge: 연속 운동 배지
- [ ] VolumeBadge: 운동량 배지
- [ ] PersonalBest: 개인 기록 배지
- [ ] NewUnlock: 새로 해금된 배지

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 기본 축하 화면 구현
- [ ] `CelebrationMessage` 컴포넌트 구현
- [ ] 랜덤 메시지 선택 로직 구현
- [ ] 축하 애니메이션 효과 추가

### 2단계: 운동 요약 표시 구현
- [ ] `WorkoutSummaryCard` 컴포넌트 구현
- [ ] 운동 데이터 요약 계산 로직
- [ ] 시간, 세트, 중량 등 통계 포맷팅

### 3단계: 테스트 작성
- [ ] `CelebrationMessage` 단위 테스트 작성
- [ ] `WorkoutSummaryCard` 단위 테스트 작성
- [ ] 메시지 선택 로직 테스트
- [ ] 데이터 포맷팅 함수 테스트

### 4단계: 스토리북 설정
- [ ] `WorkoutCompleteView` 스토리 작성
- [ ] 다양한 운동 타입별 스토리 구현
- [ ] 애니메이션 효과 확인용 스토리
- [ ] 인터랙션 테스트 추가

### 5단계: 데이터 저장 및 통계 관리
- [ ] 운동 완료 데이터 저장 서비스 구현
- [ ] 사용자 통계 업데이트 로직
- [ ] 운동 기록 히스토리 관리
- [ ] 데이터 검증 및 에러 처리

### 6단계: 성취 시스템 구현 (선택적)
- [ ] `AchievementBadge` 컴포넌트 구현
- [ ] 성취 조건 정의 및 검사 로직
- [ ] 배지 해금 알림 시스템
- [ ] 성취 데이터 저장 관리

### 7단계: Container Component 구현
- [ ] `WorkoutCompleteContainer` 구현
- [ ] 데이터 저장 및 통계 업데이트 통합
- [ ] 라우팅 로직 구현
- [ ] 에러 상태 처리

### 8단계: UX 개선 및 최적화
- [ ] 축하 애니메이션 및 시각 효과
- [ ] 사운드 효과 추가 (선택적)
- [ ] 공유 기능 (소셜 미디어, 스크린샷)
- [ ] 성능 최적화

---

## 🔧 기술적 고려사항

### 의존성
- 애니메이션 라이브러리 (Framer Motion, React Spring 등)
- 데이터 저장 서비스 (이전 구현된 서비스 확장)
- 날짜/시간 처리 라이브러리 (date-fns, dayjs)
- 공유 기능을 위한 Web Share API (선택적)

### 파일 구조
```
src/
  pages/
    workout-complete/
      components/
        WorkoutCompleteView.tsx
        WorkoutCompleteView.test.tsx
        WorkoutCompleteView.stories.tsx
        CelebrationMessage.tsx
        CelebrationMessage.test.tsx
        CelebrationMessage.stories.tsx
        WorkoutSummaryCard.tsx
        WorkoutSummaryCard.test.tsx
        AchievementBadge.tsx
        AchievementBadge.stories.tsx
        ActionButtons.tsx
      containers/
        WorkoutCompleteContainer.tsx
        WorkoutCompleteContainer.test.tsx
      services/
        achievementService.ts
        achievementService.test.ts
        statisticsService.ts
        statisticsService.test.ts
      utils/
        celebrationMessages.ts
        workoutSummaryCalculator.ts
        workoutSummaryCalculator.test.ts
      index.ts
```

### 축하 메시지 시스템
```typescript
const selectCelebrationMessage = (
  workoutData: WorkoutCompletionData,
  userStats: UserStatistics
): CelebrationMessage => {
  // 운동 타입에 따른 메시지 필터링
  const exerciseTypes = workoutData.exercises.map(ex => ex.bodyPart);
  const isCardioFocused = exerciseTypes.includes('cardio');
  const isStrengthFocused = exerciseTypes.some(type => type !== 'cardio');
  
  // 연속 운동 일수에 따른 메시지
  if (userStats.currentStreak >= 7) {
    return getRandomFromCategory('consistency');
  }
  
  // 운동 타입별 메시지
  if (isCardioFocused && !isStrengthFocused) {
    return getRandomFromCategory('cardio');
  } else if (isStrengthFocused && !isCardioFocused) {
    return getRandomFromCategory('strength');
  }
  
  // 기본 메시지
  return getRandomFromCategory('general');
};
```

### 통계 계산
```typescript
const calculateWorkoutStats = (session: WorkoutSession): WorkoutCompletionData => {
  const duration = Math.round((session.endTime - session.startTime) / (1000 * 60));
  const totalSets = session.completedSets.length;
  const totalWeight = session.completedSets
    .filter(set => set.weight)
    .reduce((sum, set) => sum + (set.weight * set.reps), 0);
  const totalCardioTime = session.completedSets
    .filter(set => set.duration)
    .reduce((sum, set) => sum + set.duration, 0);

  return {
    sessionId: session.id,
    completedAt: session.endTime,
    duration,
    exercises: groupExercisesByType(session.completedSets),
    totalSets,
    totalWeight,
    totalCardioTime,
    caloriesBurned: estimateCalories(session.completedSets)
  };
};
```

### 접근성 고려사항
- 축하 메시지를 스크린 리더가 읽을 수 있도록 적절한 ARIA 설정
- 애니메이션에 대한 접근성 고려 (motion 감소 설정 존중)
- 키보드 네비게이션으로 모든 버튼 접근 가능
- 색상만으로 정보를 전달하지 않도록 주의

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 랜덤 축하 메시지가 적절하게 표시
- [ ] 운동 요약 정보가 정확하게 계산되어 표시
- [ ] 운동 완료 데이터가 올바르게 저장
- [ ] 통계 업데이트가 정확하게 수행
- [ ] 액션 버튼 클릭 시 올바른 화면으로 이동
- [ ] 축하 애니메이션 구현 완료
- [ ] 반응형 디자인 구현
- [ ] 접근성 기준 충족
- [ ] 성취 시스템 구현 (선택적 기능) 