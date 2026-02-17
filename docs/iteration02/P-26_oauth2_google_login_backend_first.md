# 개발 계획서: P-26 OAuth2 구글 로그인 (BE 우선)

---

## 📌 개발 목표

- Firebase Auth 의존 없이 OAuth2 Authorization Code 기반 구글 로그인 플로우를 구현한다.
- `client_id`, `redirect_uri` 등 인증 시작에 필요한 값은 FE 하드코딩이 아니라 BE가 관리한다.
- 인증 성공 시 BE가 발급한 Bearer Token을 FE에서 저장/재사용한다.

---

## 🔧 변경 원칙

1. 로그인 시작/검증 책임은 BE가 가진다.
- FE는 provider 목록 조회, 시작 API 진입, 콜백 후 exchange 호출만 수행한다.

2. OAuth 보안 파라미터를 필수로 처리한다.
- `state`는 BE가 생성/저장/검증하며 1회용으로 사용한다.

3. SPA 흐름을 유지한다.
- Google 인증 완료 후 FE 라우트(`/auth/google/loggedIn`)로 복귀하고, 해당 페이지에서 BE exchange API를 호출한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-01_home.md`
- BE (생성/수정 예정)
  - `apps/nest-backend/src/app/app.module.ts`
  - `apps/nest-backend/src/app/auth/auth.controller.ts` (신규)
  - `apps/nest-backend/src/app/auth/auth.service.ts` (신규)
  - `apps/nest-backend/src/app/auth/dto/*` (신규)
- FE (생성/수정 예정)
  - `apps/web-client/src/pages/home/Home.tsx`
  - `apps/web-client/src/pages/home/HomeView.tsx`
  - `apps/web-client/src/app/app.tsx` (라우트 등록)
  - `apps/web-client/src/pages/auth-google-logged-in/AuthGoogleLoggedIn.tsx` (신규)

---

## 📝 작업 항목

### 1. BE 측 API 구현

#### 1.1 AuthProvider 목록 조회
- [ ] `GET /api/auth/providers` 구현
- [ ] 응답에 Google provider id/label/startUrl 포함

#### 1.2 AuthProvider 의 값으로 GET start 요청시 redirect 302 구현
- [ ] `GET /api/auth/google/start` 구현
- [ ] BE에서 `state` 생성/저장(TTL)
- [ ] Google authorize URL 생성 후 `302` 리다이렉트
  - [ ] `client_id`, `redirect_uri`, `scope`, `state`, `response_type=code` 포함

#### 1.3 exchange API 구현
- [ ] `POST /api/auth/google/exchange` 구현
- [ ] 요청 body(`code`, `state`) 검증
- [ ] 저장된 `state` 검증
- [ ] Google token endpoint 교환/검증
- [ ] 성공 시 앱 Bearer Token 발급/응답

### 2. FE 측 구현

#### 2.1 랜딩페이지에서 AuthProvider 목록 조회
- [ ] 홈 진입 시 `GET /api/auth/providers` 호출
- [ ] 응답 결과로 로그인 버튼 렌더링

#### 2.2 GET 요청
- [ ] Google 버튼 클릭 시 `window.location.href = /api/auth/google/start` 이동

#### 2.3 exchange API 호출
- [ ] `/auth/google/loggedIn` 라우트/페이지 구현
- [ ] URL query에서 `code`, `state` 추출
- [ ] `POST /api/auth/google/exchange` 호출
- [ ] 성공 시 Bearer Token을 `localStorage`에 저장
- [ ] 저장 후 후속 화면으로 이동(기본: S-02)

---

## ✅ 완료 기준

- [ ] 홈에서 AuthProvider 목록 조회 기반으로 구글 로그인 버튼이 노출된다
- [ ] 구글 로그인 시작 시 BE `302` 리다이렉트가 동작한다
- [ ] `/auth/google/loggedIn`에서 exchange API 호출이 동작한다
- [ ] exchange 성공 시 Bearer Token이 `localStorage`에 저장된다
- [ ] 실패 시 에러 상태가 사용자에게 표시된다
