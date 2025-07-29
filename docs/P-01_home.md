# 개발 계획서: P-01 홈 화면

---

## 📌 개발 목표

- 사용자가 앱에 진입했을 때 가장 먼저 보는 화면으로, 직관적이고 간단한 UI 제공
- 운동 시작 버튼을 통한 명확한 진입점 제공
- 앱의 브랜딩과 사용자 경험을 고려한 첫인상 구현

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `HomeView`: 홈 화면 전체 레이아웃 및 UI 담당
- `AppTitle`: 앱 타이틀/로고 표시 컴포넌트
- `StartWorkoutButton`: 운동 시작 버튼 컴포넌트

### Container Components
- `HomeContainer`: 홈 화면 비즈니스 로직 및 라우팅 담당

---

## ⚙️ 필요한 기능 및 상태 관리

### 상태 관리
- 로딩 상태 관리
- 최근 운동 요약 정보 (향후 확장 예정)

### 주요 기능
- 운동 시작 버튼 클릭 시 프리셋 선택 화면으로 라우팅
- 앱 초기화 로직

---

## 🧪 테스트 계획

### Unit Tests (`HomeView.test.tsx`)
- [ ] 홈 화면이 올바르게 렌더링되는지 확인
- [ ] 운동 시작 버튼이 표시되는지 확인
- [ ] 버튼 클릭 이벤트가 올바르게 처리되는지 확인

### Integration Tests (`HomeContainer.test.tsx`)
- [ ] 운동 시작 버튼 클릭 시 올바른 라우팅이 발생하는지 확인
- [ ] 초기 데이터 로딩이 올바르게 이루어지는지 확인

---

## 📚 스토리북 계획

### Stories (`HomeView.stories.tsx`)
- [ ] Default: 기본 홈 화면 상태
- [ ] Loading: 로딩 상태

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 기본 컴포넌트 구조 설정
- [ ] `HomeView` 컴포넌트 생성 및 기본 레이아웃 구현
- [ ] `AppTitle` 컴포넌트 생성
- [ ] `StartWorkoutButton` 컴포넌트 생성
- [ ] CSS 모듈 설정

### 2단계: 테스트 작성
- [ ] `HomeView.test.tsx` 작성
- [ ] 기본 렌더링 테스트 구현
- [ ] 버튼 클릭 테스트 구현

### 3단계: 스토리북 설정
- [ ] `HomeView.stories.tsx` 작성
- [ ] 다양한 상태의 스토리 구현

### 4단계: Container 컴포넌트 구현
- [ ] `HomeContainer` 컴포넌트 생성
- [ ] 라우팅 로직 구현
- [ ] 상태 관리 로직 구현

### 5단계: 통합 테스트
- [ ] `HomeContainer.test.tsx` 작성
- [ ] 라우팅 테스트 구현
- [ ] 전체 플로우 테스트

### 6단계: 스타일링 및 최적화
- [ ] 반응형 디자인 구현
- [ ] 접근성 고려사항 적용
- [ ] 성능 최적화

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅
- 상태 관리 라이브러리 (Context API 또는 Zustand)

### 파일 구조
```
src/
  pages/
    home/
      components/
        HomeView.tsx
        HomeView.test.tsx
        HomeView.stories.tsx
        AppTitle.tsx
        StartWorkoutButton.tsx
      containers/
        HomeContainer.tsx
        HomeContainer.test.tsx
      index.ts
```

### Clean Architecture 적용
- Presentation Layer: HomeView, AppTitle, StartWorkoutButton
- Application Layer: HomeContainer
- Domain Layer: 운동 관련 엔티티 및 유스케이스
- Infrastructure Layer: 라우팅, 로컬 스토리지 등

---

## ✅ 완료 기준

- [ ] 모든 테스트가 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태가 올바르게 표시
- [ ] 운동 시작 버튼 클릭 시 프리셋 선택 화면으로 정상 이동
- [ ] 반응형 디자인 구현 완료
- [ ] 접근성 기준 충족 