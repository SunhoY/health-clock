# 개발 계획서: P-04 루틴 만들기 - 세부 운동 선택 화면

---

## 📌 개발 목표

- 선택된 운동 부위에 해당하는 세부 운동 목록을 표시하고 선택할 수 있는 기능 구현
- 동적으로 운동 목록을 로드하고 표시하는 시스템 구현
- 선택된 운동 정보를 다음 단계로 전달하는 기능 구현

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `ExerciseSelectionView`: 운동 선택 화면 전체 레이아웃 (운동 목록, 제목 포함)

### Controller Components
- `ExerciseSelection`: 운동 목록 로딩 및 선택 로직 담당

---

## ⚙️ 필요한 기능

### 주요 기능
- 부위별 운동 목록 조회
- 운동 선택 시 다음 화면으로 라우팅
- 루틴 생성 화면에서 부위 선택 시 이 화면으로 라우팅

### 데이터 모델
```typescript
interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  description?: string;
  instructions?: string[];
  equipment?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface ExercisesByBodyPart {
  [bodyPart: string]: Exercise[];
}

const EXERCISES_DATA: ExercisesByBodyPart = {
  chest: [
    { id: 'bench-press', name: '벤치프레스', bodyPart: 'chest', equipment: ['바벨', '벤치'] },
    { id: 'incline-bench-press', name: '인클라인 벤치프레스', bodyPart: 'chest', equipment: ['바벨', '인클라인 벤치'] },
    { id: 'dumbbell-fly', name: '덤벨 플라이', bodyPart: 'chest', equipment: ['덤벨', '벤치'] },
    { id: 'push-up', name: '푸쉬업', bodyPart: 'chest', equipment: [] }
  ],
  back: [
    { id: 'barbell-row', name: '바벨 로우', bodyPart: 'back', equipment: ['바벨'] },
    { id: 'lat-pulldown', name: '렛풀다운', bodyPart: 'back', equipment: ['케이블 머신'] },
    { id: 'deadlift', name: '데드리프트', bodyPart: 'back', equipment: ['바벨'] },
    { id: 'seated-row', name: '시티드 로우', bodyPart: 'back', equipment: ['케이블 머신'] }
  ],
  legs: [
    { id: 'squat', name: '스쿼트', bodyPart: 'legs', equipment: ['바벨'] },
    { id: 'leg-press', name: '레그프레스', bodyPart: 'legs', equipment: ['레그프레스 머신'] },
    { id: 'leg-curl', name: '레그컬', bodyPart: 'legs', equipment: ['레그컬 머신'] },
    { id: 'lunge', name: '런지', bodyPart: 'legs', equipment: ['덤벨'] }
  ],
  shoulders: [
    { id: 'shoulder-press', name: '숄더프레스', bodyPart: 'shoulders', equipment: ['바벨'] },
    { id: 'lateral-raise', name: '사이드 레터럴 레이즈', bodyPart: 'shoulders', equipment: ['덤벨'] },
    { id: 'rear-delt-fly', name: '리어 델트 플라이', bodyPart: 'shoulders', equipment: ['덤벨'] }
  ],
  arms: [
    { id: 'bicep-curl', name: '바이셉 컬', bodyPart: 'arms', equipment: ['덤벨'] },
    { id: 'tricep-extension', name: '트라이셉 익스텐션', bodyPart: 'arms', equipment: ['덤벨'] },
    { id: 'hammer-curl', name: '해머 컬', bodyPart: 'arms', equipment: ['덤벨'] }
  ],
  abs: [
    { id: 'crunch', name: '크런치', bodyPart: 'abs', equipment: [] },
    { id: 'plank', name: '플랭크', bodyPart: 'abs', equipment: [] },
    { id: 'leg-raise', name: '레그레이즈', bodyPart: 'abs', equipment: [] },
    { id: 'russian-twist', name: '러시안 트위스트', bodyPart: 'abs', equipment: [] }
  ],
  calves: [
    { id: 'calf-raise', name: '카프 레이즈', bodyPart: 'calves', equipment: ['덤벨'] },
    { id: 'seated-calf-raise', name: '시티드 카프 레이즈', bodyPart: 'calves', equipment: ['카프 머신'] }
  ],
  fullbody: [
    { id: 'burpee', name: '버피', bodyPart: 'fullbody', equipment: [] },
    { id: 'mountain-climber', name: '마운틴 클라이머', bodyPart: 'fullbody', equipment: [] },
    { id: 'thruster', name: '스러스터', bodyPart: 'fullbody', equipment: ['덤벨'] }
  ],
  cardio: [
    { id: 'treadmill', name: '러닝머신', bodyPart: 'cardio', equipment: ['러닝머신'] },
    { id: 'stationary-bike', name: '싸이클', bodyPart: 'cardio', equipment: ['실내 자전거'] },
    { id: 'stepper', name: '스텝퍼', bodyPart: 'cardio', equipment: ['스텝퍼'] },
    { id: 'jump-rope', name: '줄넘기', bodyPart: 'cardio', equipment: ['줄넘기'] }
  ]
};
```

---

## 🧪 테스트 계획

### Unit Tests (`ExerciseSelectionView.test.tsx`)
- [ ] 선택된 부위명이 제목에 올바르게 표시
- [ ] 해당 부위의 운동 목록이 모두 렌더링
- [ ] 운동 버튼 클릭 시 콜백 함수 호출
- [ ] 빈 운동 목록일 때 적절한 메시지 표시

### Unit Tests (`ExerciseSelection.test.tsx`)
- [ ] 부위 변경 시 운동 목록이 올바르게 업데이트
- [ ] 운동 선택 시 콘솔에 로그 출력
- [ ] 운동 선택 후 다음 화면으로 라우팅 준비

---

## 📚 스토리북 계획

### Stories (`ExerciseSelectionView.stories.tsx`)
- [ ] ChestExercises: 가슴 운동 목록 표시
- [ ] BackExercises: 등 운동 목록 표시
- [ ] CardioExercises: 유산소 운동 목록 표시
- [ ] EmptyState: 운동 목록이 없는 상태

### Stories (`ExerciseSelection.stories.tsx`)
- [ ] Default: 기본 운동 선택 화면 (라우터 컨텍스트 포함)

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 구조 정의
- [ ] 운동 관련 타입 정의 확장
- [ ] 부위별 운동 데이터 정의

### 2단계: Presentational Component 구현
- [ ] `ExerciseSelectionView` 컴포넌트 구현 (운동 목록, 제목 포함)

### 3단계: 테스트 작성
- [ ] `ExerciseSelectionView` 단위 테스트 작성
- [ ] 접근성 테스트 포함

### 4단계: 스토리북 설정
- [ ] `ExerciseSelectionView` 스토리 작성
- [ ] `ExerciseSelection` 스토리 작성

### 5단계: Controller Component 구현
- [ ] `ExerciseSelection` 구현
- [ ] 부위별 운동 로딩 로직 구현
- [ ] 운동 선택 및 라우팅 로직 구현

### 6단계: 통합 테스트
- [ ] `ExerciseSelection` 컴포넌트 테스트 작성

### 7단계: 스타일링 및 UX 개선
- [ ] 반응형 리스트 레이아웃 구현
- [ ] 호버 및 포커스 상태 스타일링
- [ ] 선택 애니메이션 효과 추가
- [ ] 접근성 개선 (키보드 네비게이션, 스크린 리더 지원)

### 8단계: 라우팅 연결
- [ ] App.tsx에 운동 선택 화면 라우트 추가
- [ ] 루틴 생성 화면에서 부위 선택 시 이 화면으로 라우팅 연결

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅
- CSS Grid 또는 Flexbox for 레이아웃

### 파일 구조
```
src/
  pages/
    exercise-selection/
      ExerciseSelectionView.tsx
      ExerciseSelectionView.test.tsx
      ExerciseSelectionView.stories.tsx
      ExerciseSelection.tsx
      ExerciseSelection.test.tsx
      ExerciseSelection.stories.tsx
      index.ts
```

### Clean Architecture 적용
- **Presentation Layer**: `ExerciseSelectionView` - UI 표시만 담당
- **Application Layer**: `ExerciseSelection` - 비즈니스 로직 및 라우팅 담당

### 접근성 고려사항
- ARIA 레이블 및 역할 정의
- 키보드 네비게이션 지원
- 포커스 관리
- 스크린 리더 지원

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 운동 목록의 메모이제이션

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 부위별 운동 목록 확인 가능
- [ ] 선택된 부위에 따라 올바른 운동 목록 표시
- [ ] 운동 선택 시 콘솔에 로그 출력
- [ ] 반응형 리스트 레이아웃 구현
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 키보드 네비게이션 완전 지원
- [ ] 운동 선택 애니메이션 구현
- [ ] 루틴 생성 화면에서 부위 선택 시 이 화면으로 정상 이동 