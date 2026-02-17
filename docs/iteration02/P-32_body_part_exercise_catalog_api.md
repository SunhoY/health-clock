# 개발 계획서: P-32 부위별 운동 목록 조회/생성/삭제 API

---

## 📌 개발 목표

- 부위를 선택했을 때(S-04) 노출되는 운동 목록을 서버 API 기반으로 조회한다.
- 특정 부위에 새 운동을 추가할 수 있는 생성 API를 제공한다.
- 운동 삭제는 하드 삭제 대신 비활성화(soft delete)로 처리해 데이터 정합성을 보장한다.

---

## 🔧 변경 원칙

1. 운동 카탈로그는 서버 단일 소스를 사용한다.
- FE의 정적 `EXERCISES_DATA` 의존을 제거하고 API 응답으로 목록을 렌더링한다.

2. 식별자는 `exercise.code`를 외부 API 키로 사용한다.
- 내부 PK(UUID)와 분리해 FE 라우팅/식별 안정성을 유지한다.

3. 삭제는 soft delete를 기본으로 한다.
- `routines -> routine_exercises -> exercises` 참조 관계가 있으므로 `is_active=false`로 비활성화한다.

4. API 경계에서 검증을 강제한다.
- `bodyPartId`, `code`, `name`, `exerciseType` 등은 서버에서 유효성 검증 후 저장한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-04_create_routine_exercise.md`
- BE
  - `apps/nest-backend/src/app/exercises/exercises.controller.ts`
  - `apps/nest-backend/src/app/exercises/exercises.service.ts`
  - `apps/nest-backend/src/app/exercises/exercises.repository.ts`
  - `apps/nest-backend/src/app/exercises/dto/*` (신규 DTO 추가)
  - `prisma/schema.prisma` (필요 시 필드/인덱스 보강)
- FE
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.tsx`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelectionView.tsx`
  - `apps/web-client/src/pages/exercise-selection/*.test.tsx`
  - `apps/web-client/src/types/exercise.ts`

---

## 📝 작업 항목

### 1) API 계약 정의
- [ ] 조회: `GET /api/body-parts/:bodyPartId/exercises`
- [ ] 생성: `POST /api/body-parts/:bodyPartId/exercises`
- [ ] 삭제(비활성화): `DELETE /api/exercises/:exerciseCode`
- [ ] 공통 응답 필드 확정: `code`, `name`, `bodyPart`, `exerciseType`, `equipment`, `difficulty`

### 2) 백엔드 구현
- [ ] bodyPart 존재/활성 상태 검증
- [ ] 조회 시 `is_active=true` 조건 + 정렬 기준 적용
- [ ] 생성 시 중복 코드 검증(`code UNIQUE`) 및 입력 검증
- [ ] 삭제 시 `is_active=false`, `updated_at` 갱신
- [ ] 삭제 대상 미존재/이미 비활성 상태 처리 정책 정의(404 또는 204)

### 3) 프론트 연동
- [ ] S-04 운동 목록 조회를 API 연동으로 전환
- [ ] 로딩/실패/빈 목록 상태 UI 추가
- [ ] 생성/삭제 시 목록 재조회 또는 낙관적 업데이트 정책 확정
- [ ] edit/create 플로우에서 기존 라우팅 호환성 확인

### 4) 테스트
- [ ] BE controller/service/repository 테스트 추가
- [ ] 조회/생성/삭제 성공/실패/검증 오류 케이스 검증
- [ ] FE에서 API 성공/실패/빈 목록 렌더링 테스트 추가

---

## ✅ 완료 기준

- [ ] 부위 선택 후 운동 목록이 서버 API 결과로 표시된다
- [ ] 부위별 운동 추가 API가 정상 동작한다
- [ ] 운동 삭제 API가 soft delete로 동작한다
- [ ] FE에서 삭제된 운동은 목록에 노출되지 않는다
- [ ] 관련 테스트가 통과한다

---

## 📎 API 예시

### 1) 조회

`GET /api/body-parts/chest/exercises`

```json
[
  {
    "code": "bench-press",
    "name": "벤치프레스",
    "bodyPart": "chest",
    "exerciseType": "strength",
    "equipment": ["바벨", "벤치"],
    "difficulty": "intermediate"
  }
]
```

### 2) 생성

`POST /api/body-parts/chest/exercises`

```json
{
  "code": "decline-bench-press",
  "name": "디클라인 벤치프레스",
  "exerciseType": "strength",
  "equipment": ["바벨", "벤치"],
  "difficulty": "intermediate"
}
```

### 3) 삭제(비활성화)

`DELETE /api/exercises/decline-bench-press`

- 응답: `204 No Content`
