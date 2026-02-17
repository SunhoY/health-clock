# 개발 계획서: P-31 운동 부위 추가 API

---

## 📌 개발 목표

- 운영/관리 측면에서 새로운 운동 부위를 API로 등록할 수 있도록 한다.
- 등록된 부위는 P-30의 부위 목록 조회 API(`GET /api/exercises/body-parts`)에 즉시 반영되도록 한다.
- 중복/무효 데이터 입력을 방지해 부위 마스터 데이터의 일관성을 보장한다.

---

## 🔧 변경 원칙

1. 부위는 마스터 데이터로 관리한다.
- 문자열 직접 입력 방식이 아니라 `body_parts` 기준으로 생성/조회 흐름을 통일한다.

2. 식별자와 표시명은 분리한다.
- API/라우팅 식별자는 `id(code)`를 사용하고, UI 노출은 `name`을 사용한다.

3. 입력 검증을 서버에서 강제한다.
- `id` 포맷, `name` 길이, 정렬 순서(`sortOrder`)를 검증하고, 중복 시 409를 반환한다.

4. P-30과 정합성을 맞춘다.
- P-30 조회 API는 `body_parts`를 소스로 읽고, 없으면 fallback 없이 명시적 실패/빈값 정책을 적용한다.

---

## 🧩 대상 문서/코드

- 문서
  - `docs/db-schema/database-design.md`
  - `docs/user-scenario/S-03_create_routine.md` (필요 시 운영 정책 문구)
- BE
  - `prisma/schema.prisma`
  - `apps/nest-backend/src/app/app.module.ts`
  - `apps/nest-backend/src/app/exercises/exercises.module.ts`
  - `apps/nest-backend/src/app/exercises/exercises.controller.ts`
  - `apps/nest-backend/src/app/exercises/exercises.service.ts`
  - `apps/nest-backend/src/app/exercises/exercises.repository.ts`
  - `apps/nest-backend/src/app/exercises/dto/create-body-part.dto.ts` (신규)
  - `apps/nest-backend/src/app/exercises/dto/body-part.dto.ts`

---

## 📝 작업 항목

### 1) DB/스키마 준비
- [ ] `body_parts` 테이블(또는 동등한 Prisma 모델) 추가
- [ ] 컬럼 정의: `id(code)`, `name`, `sort_order`, `is_active`, `created_at`, `updated_at`
- [ ] 제약조건: `id` PK, `name` UNIQUE, `sort_order` 인덱스
- [ ] 기존 운동(`exercises.body_part`)과의 호환 전략 정리

### 2) 생성 API 구현
- [ ] `POST /api/exercises/body-parts` 엔드포인트 추가
- [ ] 요청 스키마: `id`, `name`, `sortOrder`(선택), `isActive`(선택)
- [ ] 검증 규칙: `id`는 소문자/하이픈 규칙, `name` 공백 제거 후 1자 이상
- [ ] 중복(`id` 또는 `name`) 등록 시 409 Conflict 반환
- [ ] 성공 시 생성된 부위 DTO(`id`, `name`) 반환

### 3) 조회 API와 연결(P-30 연계)
- [ ] `GET /api/exercises/body-parts`가 `body_parts` 기준으로 동작하도록 정리
- [ ] `is_active=true` + `sort_order ASC` 정렬
- [ ] 등록 직후 조회 시 신규 부위가 노출되는지 검증

### 4) 테스트
- [ ] BE: controller/service/repository 테스트 추가
- [ ] 성공/중복/검증실패(400)/서버실패(500) 케이스 검증
- [ ] P-30 조회 테스트와 함께 통합 시나리오(생성 후 조회) 검증

---

## ✅ 완료 기준

- [ ] API로 신규 운동 부위를 생성할 수 있다
- [ ] 중복/무효 입력이 서버에서 차단된다
- [ ] 생성된 부위가 P-30 부위 조회 API에 반영된다
- [ ] 관련 테스트가 통과한다

---

## 📎 API 예시

### 요청

```json
{
  "id": "glutes",
  "name": "둔근",
  "sortOrder": 10,
  "isActive": true
}
```

### 응답

```json
{
  "id": "glutes",
  "name": "둔근"
}
```
