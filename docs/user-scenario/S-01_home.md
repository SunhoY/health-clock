# 화면기획서: S-01 홈 화면

---

## 📌 개요

* **화면명**: 홈
* **목적**: 사용자가 앱 실행 후 3초 내에 운동 시작 행동을 선택할 수 있게 한다

---

## 📂 구성 요소

* **타이틀 영역**: 앱명 또는 로고
* **보조 문구**: 오늘 운동을 시작해요.
* **메인 버튼 (하단 고정, Primary)**:

  * `[운동 시작]`
  * 클릭 시 S-02 프리셋 선택 화면으로 이동

* **보조 버튼 (Secondary)**:

  * `[구글 로그인]`
  * 클릭 시 OAuth2 로그인 시작 API 호출

* **모바일 UI 기준**:

  * 버튼 터치 영역 최소 44x44px
  * Primary/Secondary 대비를 명확히 구분
  * 설명 문구는 1줄 유지

---

## 🔁 동작

* 앱 실행 시 가장 먼저 진입
* `[운동 시작]` 클릭 시 ➝ S-02 프리셋 선택 화면 이동
* 랜딩 진입 시 ➝ `GET /api/auth/providers` 호출하여 사용 가능한 인증 제공자 목록을 조회
* `[구글 로그인]` 클릭 시 ➝ `GET /api/auth/google/start`로 이동
  * BE는 `state`를 생성/저장하고 Google 인증 URL로 `302` 리다이렉트
* Google 인증 성공 시 ➝ `http://localhost:4200/auth/google/loggedIn?code=...&state=...`로 복귀
* `/auth/google/loggedIn` 페이지에서 `POST /api/auth/google/exchange` 호출
  * body: `code`, `state`
* BE는 Google에 code 교환/검증을 수행
* 검증 성공 시 BE가 앱 인증 토큰(Bearer Token)을 반환
* FE는 토큰을 `localStorage`에 저장하고 이후 API 요청에 재사용
