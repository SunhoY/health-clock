# 개발 계획서: P-02 프리셋 선택 화면

---

## 📌 개발 목표

- 사용자가 저장된 운동 루틴(프리셋)을 선택하거나 새로운 루틴을 생성할 수 있는 화면 구현
- 프리셋이 없는 경우와 있는 경우의 상태를 적절히 처리
- 직관적인 프리셋 목록 표시 및 선택 기능 제공

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `PresetSelectionView`: 프리셋 선택 화면 전체 레이아웃
- `PresetList`: 프리셋 목록 표시 컴포넌트
- `PresetCard`: 개별 프리셋 카드 컴포넌트
- `EmptyPresetState`: 프리셋이 없을 때 표시되는 컴포넌트
- `AddWorkoutButton`: 운동 추가 버튼 컴포넌트

### Container Components
- `PresetSelectionContainer`: 프리셋 데이터 관리 및 비즈니스 로직

---

## ⚙️ 필요한 기능 및 상태 관리

### 상태 관리
- 프리셋 목록 데이터
- 로딩 상태
- 에러 상태

### 주요 기능
- 저장된 프리셋 목록 조회
- 프리셋 선택 시 운동 진행 화면으로 라우팅
- 새 운동 추가 시 루틴 생성 플로우로 라우팅
- 프리셋 삭제/편집 기능 (향후 확장)

### 데이터 모델
```typescript
interface Preset {
  id: string;
  title: string;
  exercises: Exercise[];
  createdAt: Date;
  lastUsed?: Date;
}

interface Exercise {
  id: string;
  part: string;
  name: string;
  sets: number;
  weight?: number;
  duration?: number;
}
```

---

## 🧪 테스트 계획

### Unit Tests (`PresetSelectionView.test.tsx`)
- [ ] 프리셋 목록이 있을 때 올바르게 렌더링
- [ ] 프리셋이 없을 때 빈 상태 화면 표시
- [ ] 프리셋 카드 클릭 이벤트 처리
- [ ] 운동 추가 버튼 클릭 이벤트 처리

### Unit Tests (`PresetCard.test.tsx`)
- [ ] 프리셋 정보가 올바르게 표시
- [ ] 카드 클릭 시 콜백 함수 호출

### Integration Tests (`PresetSelectionContainer.test.tsx`)
- [ ] 프리셋 데이터 로딩 테스트
- [ ] 프리셋 선택 시 라우팅 테스트
- [ ] 에러 상태 처리 테스트

---

## 📚 스토리북 계획

### Stories (`PresetSelectionView.stories.tsx`)
- [ ] Default: 프리셋이 있는 기본 상태
- [ ] Empty: 프리셋이 없는 상태
- [ ] Loading: 데이터 로딩 중 상태
- [ ] Error: 에러 상태

### Stories (`PresetCard.stories.tsx`)
- [ ] Default: 일반적인 프리셋 카드
- [ ] RecentlyUsed: 최근 사용된 프리셋 카드
- [ ] LongTitle: 긴 제목을 가진 프리셋 카드

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 모델 및 타입 정의
- [ ] 프리셋 관련 TypeScript 인터페이스 정의
- [ ] 운동 관련 타입 정의
- [ ] API 응답 타입 정의

### 2단계: Presentational Components 구현
- [ ] `PresetCard` 컴포넌트 구현
- [ ] `PresetList` 컴포넌트 구현
- [ ] `EmptyPresetState` 컴포넌트 구현
- [ ] `AddWorkoutButton` 컴포넌트 구현
- [ ] `PresetSelectionView` 전체 레이아웃 구현

### 3단계: 테스트 작성
- [ ] 각 Presentational Component 테스트 작성
- [ ] 렌더링 테스트 구현
- [ ] 이벤트 핸들링 테스트 구현

### 4단계: 스토리북 설정
- [ ] 각 컴포넌트의 스토리 작성
- [ ] 다양한 상태의 스토리 구현
- [ ] 인터랙션 테스트 추가

### 5단계: 데이터 레이어 구현
- [ ] 프리셋 데이터 저장/조회 서비스 구현
- [ ] 로컬 스토리지 또는 IndexedDB 연동
- [ ] 데이터 변환 유틸리티 함수 구현

### 6단계: Container Component 구현
- [ ] `PresetSelectionContainer` 구현
- [ ] 상태 관리 로직 구현
- [ ] 라우팅 로직 구현
- [ ] 에러 핸들링 구현

### 7단계: 통합 테스트
- [ ] Container 컴포넌트 테스트 작성
- [ ] 전체 플로우 테스트
- [ ] 에러 시나리오 테스트

### 8단계: 스타일링 및 최적화
- [ ] 반응형 디자인 구현
- [ ] 애니메이션 효과 추가
- [ ] 성능 최적화 (메모이제이션 등)

---

## 🔧 기술적 고려사항

### 의존성
- 상태 관리 라이브러리 (Context API, Zustand, 또는 Redux Toolkit)
- 로컬 스토리지 관리를 위한 유틸리티
- React Router for 라우팅

### 파일 구조
```
src/
  pages/
    preset-selection/
      components/
        PresetSelectionView.tsx
        PresetSelectionView.test.tsx
        PresetSelectionView.stories.tsx
        PresetList.tsx
        PresetCard.tsx
        PresetCard.test.tsx
        PresetCard.stories.tsx
        EmptyPresetState.tsx
        AddWorkoutButton.tsx
      containers/
        PresetSelectionContainer.tsx
        PresetSelectionContainer.test.tsx
      services/
        presetService.ts
        presetService.test.ts
      index.ts
```

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 프리셋 목록 가상화 (많은 데이터가 있을 경우)
- 이미지 lazy loading (프리셋 썸네일이 있는 경우)

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 프리셋 목록이 올바르게 표시
- [ ] 프리셋 선택 시 운동 진행 화면으로 정상 이동
- [ ] 빈 상태에서 운동 추가 버튼이 올바르게 동작
- [ ] 반응형 디자인 구현 완료
- [ ] 접근성 기준 충족
- [ ] 로딩 및 에러 상태 적절히 처리 