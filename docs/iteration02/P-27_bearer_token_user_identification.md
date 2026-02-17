# 개발 계획서: P-27 인증 후 Bearer 토큰 사용자 식별

---

## 📌 개발 목표

- OAuth2 로그인(exchange) 성공 이후 앱 전용 Bearer 토큰을 발급한다.
- 이후 API 요청에서 Bearer 토큰으로 사용자를 식별할 수 있게 한다.
- 보호된 API(예: 루틴 목록 조회)는 토큰에서 추출한 `userId` 기준으로 데이터 접근을 제한한다.

---

## 🔧 변경 원칙

1. 외부 토큰과 내부 토큰 책임을 분리한다.
- Google access token/id token은 외부 인증용으로만 사용하고, 앱 API 접근은 앱 전용 Bearer 토큰으로 통일한다.

2. 인증/인가는 공통 계층으로 분리한다.
- 컨트롤러별 중복 파싱 대신 `AuthGuard` + `CurrentUser` 데코레이터로 공통 처리한다.

3. 사용자 식별은 토큰 claim 기반으로 고정한다.
- DB 조회 시 `email` 문자열 파싱이 아닌 `userId(sub)`를 1차 식별 키로 사용한다.

---

## 🧩 대상 문서/코드

- 시나리오/문서
  - `docs/user-scenario/S-01_home.md`
  - `docs/user-scenario/S-02_preset_selection.md`
  - `docs/db-schema/database-design.md`
- BE 인증
  - `apps/nest-backend/src/app/auth/auth.service.ts`
  - `apps/nest-backend/src/app/auth/auth.controller.ts`
  - `apps/nest-backend/src/app/auth/dto/google-auth-exchange-response.dto.ts`
- BE 공통 인증 계층 (신규)
  - `apps/nest-backend/src/app/auth/jwt-token.service.ts`
  - `apps/nest-backend/src/app/auth/guards/bearer-auth.guard.ts`
  - `apps/nest-backend/src/app/auth/decorators/current-user.decorator.ts`
- BE 도메인 API
  - `apps/nest-backend/src/app/routines/routines.controller.ts`
  - `apps/nest-backend/src/app/routines/routines.service.ts`
  - `apps/nest-backend/src/app/routines/routines.repository.ts`

---

## 📝 작업 항목

### 1) 토큰 발급/응답 정리
- [ ] exchange 성공 시 앱 전용 JWT(access token) 발급
- [ ] JWT claim 정의 (`sub=userId`, `email`, `provider`, `iat`, `exp`)
- [ ] `POST /api/auth/google/exchange` 응답을 앱 토큰 중심으로 정리
- [ ] 만료시간/서명키 환경변수(`AUTH_JWT_SECRET`, `AUTH_JWT_EXPIRES_IN`) 적용

### 2) Bearer 인증 공통 계층 구현
- [ ] `Authorization: Bearer <token>` 파싱/검증 Guard 구현
- [ ] 검증 성공 시 `request.user`에 사용자 컨텍스트 주입
- [ ] 검증 실패 시 401 응답 표준화
- [ ] `@CurrentUser()` 데코레이터로 컨트롤러 사용자 접근 단순화

### 3) 사용자 식별 기반 API 적용
- [ ] `GET /api/routines`를 인증 API로 전환 (`@UseGuards`)
- [ ] repository 조회 조건에 `user_id = currentUser.id` 적용
- [ ] 타 사용자 데이터 접근 불가 검증

### 4) 프론트 연동 포인트 정의
- [ ] 로그인 성공 시 앱 Bearer 토큰을 저장(localStorage)
- [ ] 보호 API 호출 시 `Authorization` 헤더 주입
- [ ] 토큰 만료/401 수신 시 재로그인 흐름 정리

### 5) 테스트
- [ ] JWT 발급/검증 단위 테스트
- [ ] Guard 성공/실패 테스트 (정상, 서명 오류, 만료)
- [ ] `GET /api/routines`가 사용자별로 분리 조회되는지 테스트
- [ ] 토큰 없는 요청 401 테스트

---

## ✅ 완료 기준

- [ ] 로그인 후 앱 전용 Bearer 토큰이 발급된다
- [ ] 보호 API가 Bearer 토큰으로 사용자를 식별한다
- [ ] 루틴 목록 조회가 토큰 사용자 기준으로만 반환된다
- [ ] 토큰 누락/오류/만료 시 401 처리된다
- [ ] 관련 테스트가 추가/수정되고 통과한다

---

## 📎 토큰/요청 예시

### exchange 응답 예시

```json
{
  "accessToken": "<app-jwt>",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "user-uuid",
    "email": "user@example.com"
  }
}
```

### 보호 API 요청 예시

```http
GET /api/routines HTTP/1.1
Authorization: Bearer <app-jwt>
```
