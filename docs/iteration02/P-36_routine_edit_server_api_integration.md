# 개발 계획서: P-36 루틴 편집 서버 API 연동

---

## 📌 개발 목표

- 루틴 편집 흐름(S-04~S-05)의 저장 동작을 로컬 상태 갱신이 아닌 서버 API 기반으로 전환한다.
- 편집 모드에서 기존 운동 수정과 신규 운동 추가를 모두 지원한다.
- 저장 완료 후 S-02에서 서버 재조회 결과로 변경사항이 즉시 보이도록 한다.

---

## 🔧 변경 원칙

1. 편집 저장의 단일 소스는 서버다.
- FE의 `updateLocalPresetExercise` 직접 반영 의존을 제거하고, API 성공 결과를 기준으로 화면을 갱신한다.

2. 편집 대상 식별자는 `routineExerciseId`를 우선 사용한다.
- 동일 `exerciseCode`가 루틴에 중복될 수 있으므로 기존 항목 수정은 항목 ID 기반으로 처리한다.

3. 수정/추가 경로를 분리한다.
- 기존 운동 수정: `PATCH /api/routines/:routineId/exercises/:routineExerciseId`
- 신규 운동 추가: `POST /api/routines/:routineId/exercises`

4. 권한 검증은 서버에서 강제한다.
- Bearer 토큰 사용자 기준으로 본인 루틴 편집만 허용한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-02_preset_selection.md`
  - `docs/user-scenario/S-03_create_routine.md`
  - `docs/user-scenario/S-04_create_routine_exercise.md`
  - `docs/user-scenario/S-05_create_routine_exercise_detail.md`
- BE
  - `apps/nest-backend/src/app/routines/routines.controller.ts`
  - `apps/nest-backend/src/app/routines/routines.service.ts`
  - `apps/nest-backend/src/app/routines/routines.repository.ts`
  - `apps/nest-backend/src/app/routines/dto/*` (편집 요청/응답 DTO 추가)
- FE
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.tsx`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelectionView.tsx`
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.tsx`
  - `apps/web-client/src/pages/preset-selection/presetApi.ts`
  - `apps/web-client/src/pages/preset-selection/PresetSelection.tsx`
- 테스트
  - `apps/nest-backend/src/app/routines/*.spec.ts`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.test.tsx`
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.test.tsx`

---

## 📝 작업 항목

### 1) 시나리오 정합성 반영
- [x] S-04/S-05에 편집 저장 API 경로(수정/추가 분리) 명시
- [x] 편집 완료 후 S-02 재조회 반영 규칙 명시

### 2) 백엔드 편집 API 구현
- [ ] `PATCH /api/routines/:routineId/exercises/:routineExerciseId` 추가
- [ ] `POST /api/routines/:routineId/exercises` 추가
- [ ] `routineId + userId` 소유권 검증
- [ ] 대상 미존재/권한 불일치 시 `404` 처리
- [ ] 입력값 유효성(세트/중량/횟수/시간) 검증

### 3) 프론트 편집 저장 연동
- [ ] `updatePresetExercise`를 실제 PATCH API 호출로 전환
- [ ] 편집 모드에서 기존 운동 vs 신규 운동 저장 분기 처리
- [ ] `[새 운동 추가하기]` 진입 경로와 저장 완료 후 흐름 정리
- [ ] 저장 성공 시 `/preset-selection` 이동 후 목록 재조회 반영
- [ ] 저장 실패 시 에러 문구 노출 및 현재 입력 유지

### 4) 테스트 보강
- [ ] BE: 수정/추가 성공, 404, 권한 실패 케이스 추가
- [ ] FE: 편집 완료 시 API 호출 및 라우팅 검증
- [ ] FE: 신규 운동 추가 저장 케이스 검증
- [ ] FE: 저장 실패 시 에러 처리/상태 유지 검증

---

## ✅ 완료 기준

- [ ] 루틴 편집 저장이 서버 API를 통해 동작한다
- [ ] 기존 운동 수정과 신규 운동 추가가 모두 동작한다
- [ ] 편집 완료 후 S-02 목록에 변경사항이 즉시 반영된다
- [ ] 실패 시 사용자에게 오류가 표시되고 입력이 보존된다
- [ ] 관련 테스트가 통과한다
