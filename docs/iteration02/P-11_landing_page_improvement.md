# 개발 계획서: P-11 랜딩 페이지 개선

---

## 📌 개발 목표

- 홈(랜딩) 페이지의 첫인상을 개선해 운동 시작 전환율을 높인다.
- 최근 수정사항(라우터 중첩 제거)과 일관되게 라우팅 구조를 단일 Router 기준으로 유지한다.
- 랜딩 페이지 관련 테스트를 실제 UI/동작과 일치하도록 정비해 회귀를 방지한다.

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `HomeView`: 랜딩 히어로, 핵심 가치 문구, CTA 버튼, 보조 안내 UI

### Container Components
- `Home`: `HomeView`에 이벤트 핸들러 전달, `/preset-selection` 라우팅 처리

### Routing
- `main.tsx`에서 `BrowserRouter`를 단일로 관리
- `app.tsx`는 `Routes`/`Route` 선언만 담당

---

## ⚙️ 필요한 기능 및 상태 관리

### 주요 기능
- 랜딩 헤더/설명 카피 개선 (앱 목적이 즉시 전달되도록 문구 정리)
- 기본 CTA(`운동 시작`) 강조 및 클릭 시 프리셋 선택 화면 이동
- 보조 액션(예: 최근 루틴 진입/기능 소개) 영역 추가 여부 검토
- 모바일/데스크톱 반응형 레이아웃 정리

### 상태 관리
- 페이지 로컬 상태는 최소화
- 향후 로그인/사용자 상태가 추가되더라도 `Home`에서 주입하고 `HomeView`는 표시 전용으로 유지

---

## 🧪 테스트 계획

### Unit Tests (`HomeView.test.tsx`)
- [ ] 랜딩 핵심 텍스트/CTA가 렌더링되는지 확인
- [ ] CTA 접근성 속성(버튼 role, 이름)이 유지되는지 확인

### Unit Tests (`Home.test.tsx`)
- [ ] CTA 클릭 시 `/preset-selection`으로 라우팅되는지 확인
- [ ] 단일 Router 전제에서 렌더링 에러가 발생하지 않는지 확인

### Regression Tests
- [ ] `App` 렌더링 시 Router 중첩 에러(`You cannot render a <Router> inside another <Router>`)가 재발하지 않도록 테스트 케이스 추가
- [ ] 랜딩 관련 텍스트 기대값이 실제 UI와 불일치하지 않도록 테스트 fixture 정리

---

## 📚 스토리북 계획

### Stories (`HomeView.stories.tsx`)
- [ ] `Default`: 기본 랜딩 상태
- [ ] `Mobile`: 작은 화면 기준 레이아웃 확인
- [ ] `HighContrast`(선택): 대비 강화 상태 확인

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 라우팅 안정성 고정
- [ ] `main.tsx` 단일 `BrowserRouter` 원칙 문서화
- [ ] `app.tsx`에서 `Routes`만 유지되는지 점검

### 2단계: 랜딩 UI 개편
- [ ] `HomeView` 카피/레이아웃 개선
- [ ] CTA 우선순위 및 시각적 강조 조정
- [ ] 반응형 구간별 여백/타이포 점검

### 3단계: 테스트 보강
- [ ] `HomeView.test.tsx`, `Home.test.tsx` 기대값 최신화
- [ ] Router 중첩 회귀 테스트 추가

### 4단계: 문서 연동
- [ ] `docs/user-scenario/S-01_home.md`를 개선된 랜딩 플로우 기준으로 업데이트

---

## 🔧 기술적 고려사항

- **React Router**: Router Provider는 엔트리(`main.tsx`)에서만 선언
- **테스트 신뢰성**: UI 텍스트 변경에 취약한 하드코딩 assertion 최소화, 의미 기반 질의 우선(`getByRole`, `getByLabelText`)
- **접근성**: 랜딩 CTA의 명확한 accessible name과 키보드 포커스 스타일 유지

---

## ✅ 완료 기준

- [ ] 랜딩 페이지 UI 개선안이 반영되고 모바일/데스크톱에서 깨짐 없음
- [ ] `운동 시작` 주요 플로우가 정상 동작
- [ ] Router 중첩 에러 회귀 방지 테스트가 포함됨
- [ ] 랜딩 관련 테스트가 최신 UI와 일치하며 모두 통과
- [ ] `S-01_home` 시나리오 문서가 최신 상태로 반영됨
