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
- `WorkoutCompleteView`: 운동 완료 화면 전체 레이아웃 (축하 메시지, 요약, 버튼 포함)

### Controller Components
- `WorkoutComplete`: 완료 데이터 처리 및 라우팅 로직 담당

---

## ⚙️ 필요한 기능

### 주요 기능
- 랜덤 축하 메시지 표시
- 운동 세션 데이터 최종 저장
- 사용자 운동 통계 업데이트
- 요약 화면 또는 추가 운동으로 라우팅
- 성취 배지 시스템 (연속 운동 일수, 목표 달성 등)
- 운동 진행 화면에서 모든 운동 완료 시 이 화면으로 라우팅

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

const selectCelebrationMessage = (
  workoutData: WorkoutCompletionData,
  userStats?: UserStatistics
): CelebrationMessage => {
  // 운동 타입에 따른 메시지 필터링
  const exerciseTypes = workoutData.exercises.map(ex => ex.bodyPart);
  const isCardioFocused = exerciseTypes.includes('cardio');
  const isStrengthFocused = exerciseTypes.some(type => type !== 'cardio');
  
  // 연속 운동 일수에 따른 메시지
  if (userStats?.currentStreak && userStats.currentStreak >= 7) {
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

---

## 🧪 테스트 계획

### Unit Tests (`WorkoutCompleteView.test.tsx`)
- [ ] 축하 메시지가 올바르게 표시되는지 확인
- [ ] 운동 요약 정보가 정확하게 표시
- [ ] 액션 버튼들이 올바르게 렌더링
- [ ] 성취 배지가 조건에 맞게 표시

### Unit Tests (`WorkoutComplete.test.tsx`)
- [ ] 운동 데이터 저장 시 콘솔에 로그 출력
- [ ] 통계 업데이트 시 콘솔에 로그 출력
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

### Stories (`WorkoutComplete.stories.tsx`)
- [ ] Default: 기본 운동 완료 화면 (라우터 컨텍스트 포함)

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 구조 정의
- [ ] 운동 완료 데이터 타입 정의
- [ ] 축하 메시지 시스템 정의
- [ ] 성취 시스템 타입 정의

### 2단계: Presentational Component 구현
- [ ] `WorkoutCompleteView` 컴포넌트 구현 (축하 메시지, 요약, 버튼 포함)

### 3단계: 테스트 작성
- [ ] `WorkoutCompleteView` 단위 테스트 작성
- [ ] 접근성 테스트 포함

### 4단계: 스토리북 설정
- [ ] `WorkoutCompleteView` 스토리 작성
- [ ] `WorkoutComplete` 스토리 작성

### 5단계: Controller Component 구현
- [ ] `WorkoutComplete` 구현
- [ ] 데이터 저장 및 통계 업데이트 로직 구현
- [ ] 라우팅 로직 구현

### 6단계: 통합 테스트
- [ ] `WorkoutComplete` 컴포넌트 테스트 작성

### 7단계: 스타일링 및 UX 개선
- [ ] 축하 애니메이션 및 시각 효과 구현
- [ ] 호버 및 포커스 상태 스타일링
- [ ] 접근성 개선 (키보드 네비게이션, 스크린 리더 지원)

### 8단계: 라우팅 연결
- [ ] App.tsx에 운동 완료 화면 라우트 추가
- [ ] 운동 진행 화면에서 모든 운동 완료 시 이 화면으로 라우팅 연결

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅
- CSS Grid 또는 Flexbox for 레이아웃

### 파일 구조
```
src/
  pages/
    workout-complete/
      WorkoutCompleteView.tsx
      WorkoutCompleteView.test.tsx
      WorkoutCompleteView.stories.tsx
      WorkoutComplete.tsx
      WorkoutComplete.test.tsx
      WorkoutComplete.stories.tsx
      index.ts
```

### Clean Architecture 적용
- **Presentation Layer**: `WorkoutCompleteView` - UI 표시만 담당
- **Application Layer**: `WorkoutComplete` - 비즈니스 로직 및 라우팅 담당

### 접근성 고려사항
- 축하 메시지를 스크린 리더가 읽을 수 있도록 적절한 ARIA 설정
- 애니메이션에 대한 접근성 고려 (motion 감소 설정 존중)
- 키보드 네비게이션으로 모든 버튼 접근 가능
- 색상만으로 정보를 전달하지 않도록 주의

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 축하 메시지 선택 로직의 메모이제이션

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 랜덤 축하 메시지가 적절하게 표시
- [ ] 운동 요약 정보가 정확하게 계산되어 표시
- [ ] 운동 완료 데이터 저장 시 콘솔에 로그 출력
- [ ] 통계 업데이트 시 콘솔에 로그 출력
- [ ] 액션 버튼 클릭 시 올바른 화면으로 이동
- [ ] 축하 애니메이션 구현 완료
- [ ] 반응형 디자인 구현
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 성취 시스템 구현 (선택적 기능)
- [ ] 운동 진행 화면에서 모든 운동 완료 시 이 화면으로 정상 이동 