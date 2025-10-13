# 개발 계획서: P-10 구글 로그인

---

## 📌 개발 목표

- 홈 화면에 구글 로그인 버튼을 추가하고, Firebase Authentication을 통한 구글 로그인 기능 구현
- 로그인 성공 시 사용자 정보를 상태로 관리하고, UI에 반영
- 로그인 상태에 따라 조건부 UI 렌더링 (예: 로그인/로그아웃 버튼 표시)

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `HomeView`: 구글 로그인 버튼을 포함한 홈 화면 UI
- `LoginButton`: 구글 로그인 기능을 수행하는 재사용 가능한 버튼

### Container Components
- `Home`: 로그인 로직 및 상태를 `HomeView`에 전달

### Hooks
- `useAuth`: `AuthProvider`로부터 인증 상태, 사용자 정보, 로그인/로그아웃 함수를 가져옴

---

## ⚙️ 필요한 기능 및 상태 관리

### 주요 기능
- 홈 화면에 구글 로그인 버튼 렌더링
- 버튼 클릭 시 Firebase 구글 로그인 팝업 호출
- 로그인 성공/실패 처리 및 피드백
- 로그인 후 사용자 정보(이름, 프로필 사진 등) 표시

### 상태 관리 (from `useAuth`)
- `user`: 현재 로그인된 사용자 정보 (User | null)
- `isLoggedIn`: 로그인 상태 (boolean)
- `isLoading`: 로그인 시도 중 로딩 상태 (boolean)

---

## 🧪 테스트 계획

### Unit Tests (`HomeView.test.tsx`)
- [ ] 구글 로그인 버튼이 정상적으로 렌더링되는지 확인
- [ ] 로그인 상태에 따라 버튼이 올바르게 표시되는지 (예: 로그인 시 "로그아웃"으로 변경)

### Unit Tests (`LoginButton.test.tsx`)
- [ ] 버튼 클릭 시 `loginWithGoogle` 함수가 호출되는지 확인

### Integration Tests
- [ ] `Home` 컴포넌트에서 구글 로그인 버튼 클릭 시 `useAuth`의 로그인 함수가 실행되고, 상태가 업데이트되는지 확인
- [ ] Firebase 연동을 포함한 전체 로그인 플로우 E2E 테스트

---

## 📚 스토리북 계획

### Stories (`HomeView.stories.tsx`)
- [ ] `LoggedOut`: 로그아웃 상태의 홈 화면 (구글 로그인 버튼 표시)
- [ ] `LoggedIn`: 로그인 상태의 홈 화면 (사용자 프로필 및 로그아웃 버튼 표시)

### Stories (`LoginButton.stories.tsx`)
- [ ] `Default`: 기본 구글 로그인 버튼
- [ ] `Loading`: 로그인 진행 중 상태

---

## 📝 개발 순서 및 할 일 목록

### 1단계: Firebase 설정 확인
- [ ] `PN-01_firebase_auth.md` 계획에 따라 Firebase 프로젝트 및 Authentication 설정이 완료되었는지 확인

### 2단계: 인증 관련 컴포넌트 및 훅 구현
- [ ] `AuthProvider` 및 `useAuth` 훅이 `PN-01` 계획에 따라 구현되었는지 확인하고, 필요시 수정

### 3단계: 로그인 버튼 컴포넌트 구현
- [ ] `LoginButton` 컴포넌트 생성
- [ ] `useAuth` 훅을 사용하여 `loginWithGoogle` 함수 호출 로직 구현

### 4단계: 홈 화면에 버튼 추가
- [ ] `HomeView` 컴포넌트에 `LoginButton` 추가
- [ ] "운동 시작" 버튼 하단에 배치

### 5단계: 조건부 UI 구현
- [ ] `Home` 컨테이너 컴포넌트에서 `useAuth`를 사용하여 로그인 상태 확인
- [ ] `isLoggedIn` 상태에 따라 `HomeView`에 다른 props 전달 (예: 사용자 정보)
- [ ] `HomeView`는 전달받은 props에 따라 로그인 버튼 또는 사용자 프로필/로그아웃 버튼을 표시

### 6단계: 테스트 및 스토리북 작성
- [ ] 위에서 계획한 유닛/통합 테스트 및 스토리북 스토리 작성

### 7단계: 스타일링 및 최종 검토
- [ ] 구글 로그인 버튼 스타일링 (Google 브랜드 가이드라인 준수 권장)
- [ ] 반응형 디자인 및 접근성 확인

---

## 🔧 기술적 고려사항

- **Firebase SDK**: `firebase/auth` 모듈을 사용하여 구글 인증 처리
- **상태 관리**: React Context API와 `useContext` 훅을 사용한 `AuthProvider` 패턴으로 전역 인증 상태 관리
- **비동기 처리**: 로그인 과정은 비동기이므로, 로딩 및 에러 상태를 적절히 처리해야 함

---

## ✅ 완료 기준

- [ ] 홈 화면에 구글 로그인 버튼이 표시됨
- [ ] 버튼 클릭 시 구글 로그인 팝업이 정상적으로 나타남
- [ ] 로그인 성공 시 홈 화면에 사용자 이름 또는 프로필이 표시됨
- [ ] 모든 관련 테스트 통과 및 스토리북 업데이트 완료
- [ ] `user-scenario/S-01_home.md` 문서가 최신화됨
