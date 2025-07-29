# 개발 계획서: P-04 루틴 만들기 - 세부 운동 선택 화면

---

## 📌 개발 목표

- 선택된 운동 부위에 해당하는 세부 운동 목록을 표시하고 선택할 수 있는 기능 구현
- 동적으로 운동 목록을 로드하고 표시하는 시스템 구현
- 선택된 운동 정보를 다음 단계로 전달하는 상태 관리 구현

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `ExerciseSelectionView`: 운동 선택 화면 전체 레이아웃
- `ExerciseList`: 운동 목록을 표시하는 리스트 컴포넌트
- `ExerciseButton`: 개별 운동 선택 버튼
- `BodyPartTitle`: 선택된 부위명을 표시하는 제목 컴포넌트

### Container Components
- `ExerciseSelectionContainer`: 운동 목록 로딩 및 선택 로직 담당

---

## ⚙️ 필요한 기능 및 상태 관리

### 상태 관리
- 선택된 운동 부위 (이전 단계에서 전달)
- 해당 부위의 운동 목록
- 선택된 운동
- 로딩 상태

### 주요 기능
- 부위별 운동 목록 조회
- 운동 선택 시 다음 화면으로 라우팅
- 선택된 운동 정보를 루틴 생성 컨텍스트에 저장

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
  cardio: [
    { id: 'treadmill', name: '러닝머신', bodyPart: 'cardio', equipment: ['러닝머신'] },
    { id: 'stationary-bike', name: '싸이클', bodyPart: 'cardio', equipment: ['실내 자전거'] },
    { id: 'stepper', name: '스텝퍼', bodyPart: 'cardio', equipment: ['스텝퍼'] },
    { id: 'jump-rope', name: '줄넘기', bodyPart: 'cardio', equipment: ['줄넘기'] }
  ]
  // ... 다른 부위들
};
```

---

## 🧪 테스트 계획

### Unit Tests (`ExerciseSelectionView.test.tsx`)
- [ ] 선택된 부위명이 제목에 올바르게 표시
- [ ] 해당 부위의 운동 목록이 모두 렌더링
- [ ] 운동 버튼 클릭 시 콜백 함수 호출
- [ ] 빈 운동 목록일 때 적절한 메시지 표시

### Unit Tests (`ExerciseButton.test.tsx`)
- [ ] 운동명이 올바르게 표시
- [ ] 클릭 이벤트가 올바르게 처리
- [ ] 운동 정보가 툴팁으로 표시 (선택적)
- [ ] 접근성 속성이 올바르게 설정

### Integration Tests (`ExerciseSelectionContainer.test.tsx`)
- [ ] 부위 변경 시 운동 목록이 올바르게 업데이트
- [ ] 운동 선택 시 상태가 올바르게 업데이트
- [ ] 운동 선택 후 다음 화면으로 라우팅
- [ ] 에러 상태 처리 테스트

---

## 📚 스토리북 계획

### Stories (`ExerciseSelectionView.stories.tsx`)
- [ ] ChestExercises: 가슴 운동 목록 표시
- [ ] BackExercises: 등 운동 목록 표시
- [ ] CardioExercises: 유산소 운동 목록 표시
- [ ] EmptyState: 운동 목록이 없는 상태
- [ ] Loading: 로딩 상태

### Stories (`ExerciseButton.stories.tsx`)
- [ ] Default: 기본 운동 버튼
- [ ] WithEquipment: 장비 정보가 있는 버튼
- [ ] WithDifficulty: 난이도 정보가 있는 버튼
- [ ] Selected: 선택된 상태의 버튼

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 구조 및 서비스 구현
- [ ] 운동 관련 타입 정의 확장
- [ ] 부위별 운동 데이터 정의
- [ ] 운동 조회 서비스 함수 구현
- [ ] 데이터 검증 로직 구현

### 2단계: Presentational Components 구현
- [ ] `ExerciseButton` 컴포넌트 구현
- [ ] `ExerciseList` 컴포넌트 구현
- [ ] `BodyPartTitle` 컴포넌트 구현
- [ ] `ExerciseSelectionView` 전체 레이아웃 구현

### 3단계: 테스트 작성
- [ ] `ExerciseButton` 단위 테스트 작성
- [ ] `ExerciseList` 단위 테스트 작성
- [ ] `ExerciseSelectionView` 단위 테스트 작성
- [ ] 데이터 서비스 테스트 작성

### 4단계: 스토리북 설정
- [ ] `ExerciseButton` 스토리 작성
- [ ] `ExerciseSelectionView` 스토리 작성
- [ ] 다양한 부위별 스토리 구현
- [ ] 인터랙션 테스트 추가

### 5단계: 상태 관리 확장
- [ ] 루틴 생성 컨텍스트에 운동 선택 로직 추가
- [ ] 운동 목록 캐싱 로직 구현
- [ ] 에러 상태 관리 추가

### 6단계: Container Component 구현
- [ ] `ExerciseSelectionContainer` 구현
- [ ] 부위별 운동 로딩 로직 구현
- [ ] 운동 선택 및 라우팅 로직 구현
- [ ] 에러 핸들링 구현

### 7단계: 통합 테스트
- [ ] Container 컴포넌트 테스트 작성
- [ ] 전체 플로우 테스트 (부위 선택 → 운동 선택)
- [ ] 에러 시나리오 테스트

### 8단계: 성능 최적화 및 UX 개선
- [ ] 운동 목록 가상화 (목록이 많은 경우)
- [ ] 검색 기능 추가 (선택적)
- [ ] 즐겨찾기 운동 표시 (선택적)
- [ ] 애니메이션 효과 추가

---

## 🔧 기술적 고려사항

### 의존성
- 이전 단계에서 구현된 루틴 생성 컨텍스트
- React Router for 라우팅
- 검색 기능을 위한 fuse.js (선택적)

### 파일 구조
```
src/
  pages/
    create-routine/
      exercise-selection/
        components/
          ExerciseSelectionView.tsx
          ExerciseSelectionView.test.tsx
          ExerciseSelectionView.stories.tsx
          ExerciseList.tsx
          ExerciseButton.tsx
          ExerciseButton.test.tsx
          ExerciseButton.stories.tsx
          BodyPartTitle.tsx
        containers/
          ExerciseSelectionContainer.tsx
          ExerciseSelectionContainer.test.tsx
        services/
          exerciseService.ts
          exerciseService.test.ts
        data/
          exercises.ts
        index.ts
```

### 데이터 관리
- 정적 데이터로 시작하여 향후 API 연동 고려
- 운동 데이터의 다국어 지원 고려
- 사용자 커스텀 운동 추가 기능 확장성 고려

### 성능 고려사항
- 운동 목록이 많을 경우 가상화 적용
- React.memo를 활용한 불필요한 리렌더링 방지
- 운동 데이터 지연 로딩

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 부위별 운동 목록 확인 가능
- [ ] 선택된 부위에 따라 올바른 운동 목록 표시
- [ ] 운동 선택 시 다음 화면으로 정상 이동
- [ ] 선택된 운동 정보가 올바르게 전달
- [ ] 반응형 리스트 레이아웃 구현
- [ ] 접근성 기준 충족
- [ ] 로딩 및 에러 상태 적절히 처리
- [ ] 운동 목록이 스크롤 가능하고 사용하기 편리 