# 화면기획서: S-01 홈 화면

---

## 📌 개요

* **화면명**: 홈
* **목적**: 비로그인 사용자는 빠르게 로그인/게스트 시작을 선택하고, 로그인 사용자는 루틴 선택으로 즉시 진입하게 한다

---

## 📂 구성 요소

* **타이틀 영역**: 앱명 또는 로고
* **보조 문구**: 오늘 운동을 시작해요.
* **메인 버튼 (하단 고정, Primary)**:

  * `[GUEST로 시작하기]`
  * 클릭 시 S-02 프리셋 선택 화면으로 이동

* **보조 버튼 (Secondary)**:

  * `[Google로 로그인]`
  * 클릭 시 OAuth2 로그인 시작 API 호출

* **자동 진입 처리 상태**:

  * 홈 진입 직후 인증 세션을 확인하는 짧은 로딩 상태를 허용
  * 유효 세션이면 버튼 노출 전에 S-02로 자동 이동

* **모바일 UI 기준**:

  * 버튼 터치 영역 최소 44x44px
  * Primary/Secondary 대비를 명확히 구분
  * 설명 문구는 1줄 유지

---

## 🔁 동작

* 앱 실행 시 가장 먼저 진입
* 홈 진입 시 로컬 인증 세션(`health-clock.google-auth`) 확인
* 세션 토큰이 존재하면 ➝ `GET /api/routines`로 유효성 확인 후 성공 시 S-02 프리셋 선택 화면으로 자동 이동(`replace`)
* 세션 검증이 실패(401/403)하면 ➝ 로컬 세션을 제거하고 현재 홈 화면 유지
* `[GUEST로 시작하기]` 클릭 시 ➝ S-02 프리셋 선택 화면 이동
* `[Google로 로그인]` 클릭 시 ➝ `GET /api/auth/google/start`로 이동
  * BE는 `state`를 생성/저장하고 Google 인증 URL로 `302` 리다이렉트
* Google 인증 성공 시 ➝ `http://localhost:4200/auth/google/loggedIn?code=...&state=...`로 복귀
* `/auth/google/loggedIn` 페이지에서 `POST /api/auth/google/exchange` 호출
  * body: `code`, `state`
* BE는 Google에 code 교환/검증을 수행
* 검증 성공 시 BE가 앱 인증 토큰(Bearer Token)을 반환
* FE는 토큰을 `localStorage`에 저장하고 이후 API 요청에 재사용
