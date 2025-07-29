# 개발 계획서: P-02 프리셋 선택 화면

---

## 📌 개발 목표

- 사용자가 저장된 운동 루틴(프리셋)을 선택하거나 새로운 루틴을 생성할 수 있는 화면 구현
- 프리셋이 없는 경우와 있는 경우의 상태를 적절히 처리
- 직관적인 프리셋 목록 표시 및 선택 기능 제공

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `PresetSelectionView`: 프리셋 선택 화면 전체 레이아웃 (프리셋 목록, 빈 상태, 버튼 포함)

### Container Components
- `PresetSelection`: 프리셋 데이터 관리 및 비즈니스 로직

---

## ⚙️ 필요한 기능 및 상태 관리

### 주요 기능
- 홈화면에서 운동 시작 버튼 클릭 시 프리셋 선택 화면으로 라우팅
- 저장된 프리셋 목록 조회
- 프리셋 선택 시 운동 진행 화면으로 라우팅
- 새로운 루틴 만들기 버튼 클릭 시 루틴 생성 화면으로 라우팅
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

### Unit Tests (`PresetSelection.test.tsx`)
- [ ] PresetSelection 컴포넌트가 올바르게 렌더링되는지 확인
- [ ] 프리셋 선택 시 올바른 라우팅이 발생하는지 확인
- [ ] 운동 추가 버튼 클릭 시 올바른 라우팅이 발생하는지 확인

---

## 📚 스토리북 계획

### Stories (`PresetSelectionView.stories.tsx`)
- [ ] Default: 프리셋이 있는 기본 상태
- [ ] Empty: 프리셋이 없는 상태

### Stories (`PresetSelection.stories.tsx`)
- [ ] Default: 기본 PresetSelection 컴포넌트 상태

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 기본 컴포넌트 구조 설정
- [ ] `PresetSelectionView` 컴포넌트 생성 및 전체 UI 구현 (프리셋 목록, 빈 상태, 버튼 포함)
- [ ] 라우팅 설정 - 홈화면에서 프리셋 선택 화면으로 라우팅 연결
- [ ] App.tsx에 프리셋 선택 화면 라우트 추가

### 2단계: 테스트 작성
- [ ] `PresetSelectionView.test.tsx` 작성
- [ ] 기본 렌더링 테스트 구현
- [ ] 버튼 클릭 테스트 구현

### 3단계: 스토리북 설정
- [ ] `PresetSelectionView.stories.tsx` 작성
- [ ] 기본 상태와 빈 상태의 스토리 구현

### 4단계: Container 컴포넌트 구현
- [ ] `PresetSelection` 컴포넌트 생성
- [ ] 라우팅 로직 구현
- [ ] 홈화면에서의 라우팅 연결 확인
- [ ] 새로운 루틴 만들기 버튼 클릭 시 루틴 생성 화면으로 라우팅 연결

### 5단계: 스타일링 및 최적화
- [ ] 반응형 디자인 구현
- [ ] 접근성 고려사항 적용
- [ ] 성능 최적화

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅

### 파일 구조
```
src/
  pages/
    preset-selection/
      PresetSelectionView.tsx
      PresetSelectionView.test.tsx
      PresetSelectionView.stories.tsx
      PresetSelection.tsx
      PresetSelection.test.tsx
      PresetSelection.stories.tsx
      index.ts
```

### Clean Architecture 적용
- Presentation Layer: PresetSelectionView
- Application Layer: PresetSelection
- Domain Layer: 프리셋 관련 엔티티 및 유스케이스
- Infrastructure Layer: 라우팅, 로컬 스토리지 등

---

## ✅ 완료 기준

- [ ] 모든 테스트가 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 기본 상태와 빈 상태가 올바르게 표시
- [ ] 홈화면에서 운동 시작 버튼 클릭 시 프리셋 선택 화면으로 정상 이동
- [ ] 새로운 루틴 만들기 버튼 클릭 시 루틴 생성 화면으로 정상 이동
- [ ] 프리셋 목록이 올바르게 표시
- [ ] 프리셋 선택 시 운동 진행 화면으로 정상 이동
- [ ] 빈 상태에서 운동 추가 버튼이 올바르게 동작
- [ ] 반응형 디자인 구현 완료
- [ ] 접근성 기준 충족 