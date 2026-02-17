# 개발 계획서: P-34 루틴 내 운동 삭제 API 연동

---

## 📌 개발 목표

- 편집 모드(S-04)에서 운동 항목 삭제를 로컬 상태 변경이 아닌 서버 API 호출 기반으로 전환한다.
- 삭제 성공 시 루틴 상세/운동 목록 상태를 서버 기준으로 재동기화한다.
- 삭제 실패 시 사용자에게 오류를 노출하고 기존 목록을 유지한다.

---

## 🔧 변경 원칙

1. 루틴 편집 데이터의 기준은 서버다.
- 삭제 후 로컬에서 임의 제거하지 않고, API 성공 후 재조회 결과를 기준으로 화면을 갱신한다.

2. 삭제 식별자는 `routineExerciseId`를 사용한다.
- 동일 `exerciseCode`가 루틴 내에 중복될 수 있으므로 루틴-운동 항목 ID 기준으로 삭제한다.

3. 삭제 반영은 성공 응답에서만 수행한다.
- `204 No Content`를 성공으로 처리하고 실패 시 목록 상태를 변경하지 않는다.

4. 권한/소유권 검증은 서버에서 강제한다.
- Bearer 토큰 사용자 기준으로 본인 루틴의 운동 항목만 삭제 가능해야 한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-04_create_routine_exercise.md`
- BE
  - `apps/nest-backend/src/app/routines/routines.controller.ts`
  - `apps/nest-backend/src/app/routines/routines.service.ts`
  - `apps/nest-backend/src/app/routines/routines.repository.ts`
- FE
  - `apps/web-client/src/pages/preset-selection/presetApi.ts`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.tsx`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelectionView.tsx`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.test.tsx`

---

## 📝 작업 항목

### 1) 시나리오 정합성 반영
- [x] S-04 편집 모드의 `[삭제]` 동작을 API 호출 기준으로 명시
- [x] 삭제 성공/실패 시 사용자 노출 상태(유지/에러) 규칙 정의

### 2) 백엔드 API 구현
- [x] 엔드포인트 추가: `DELETE /api/routines/:routineId/exercises/:routineExerciseId`
- [x] Guard 적용: Bearer 토큰 사용자만 접근 가능
- [x] `routineId + routineExerciseId + userId` 소유권 검증
- [x] 대상 미존재/권한 불일치 시 `404 Not Found` 반환
- [x] 성공 시 `204 No Content` 반환

### 3) 프론트 편집 삭제 연동
- [x] `deletePresetExercise`를 서버 API 호출로 전환
- [x] 삭제 성공 시 편집 목록 재조회(또는 동일 효과의 state 갱신) 적용
- [x] 삭제 중 중복 클릭 방지(버튼 disable) 적용
- [x] 삭제 실패 문구 노출(예: `운동 삭제에 실패했습니다.`)

### 4) 테스트 보강
- [x] BE controller/service 삭제 성공/실패 케이스 추가
- [x] FE 삭제 성공 시 목록 갱신 검증
- [x] FE 삭제 실패 시 목록 유지 및 에러 표시 검증

---

## ✅ 완료 기준

- [x] 편집 모드에서 운동 삭제가 서버 API를 통해 동작한다
- [x] 본인 루틴의 운동 항목만 삭제 가능하다
- [x] 삭제 성공 시 목록에서 제거되고 재진입 시에도 반영된다
- [x] 삭제 실패 시 목록 유지 + 오류 메시지 노출이 보장된다
- [x] 관련 테스트가 통과한다

---

## 📎 API 예시

`DELETE /api/routines/routine-123/exercises/rex-456`

- 성공: `204 No Content`
- 실패: `404 Not Found` (`Routine exercise not found.`)
