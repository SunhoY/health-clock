# 개발 계획서: P-25 편집 모드에서 새 운동 추가 지원

---

## 📌 개발 목표

- 편집 모드(`수정할 운동 선택`)에서 기존 운동 수정뿐 아니라 새 운동을 루틴에 추가할 수 있게 한다.
- 편집 모드의 저장 동작을 "기존 운동 업데이트"와 "신규 운동 추가"로 분기하고, 둘 다 mock API + 로컬 상태 갱신 흐름으로 처리한다.

---

## 🔧 변경 원칙

1. 편집 플로우는 "수정"과 "추가"를 명확히 구분한다.
- 기존 운동 진입: prefill + update
- 신규 운동 진입: 빈 입력 + append

2. 저장 경로는 API 인터페이스를 통일한다.
- 서버 미연동 환경에서는 mock API를 사용하되, 추후 실제 API로 교체 가능한 함수 시그니처를 유지한다.

3. ViewModel 반영은 즉시, 최종 반영은 완료 시점에 확정한다.
- 입력 중 상태는 화면/드래프트에 반영하고, `[완료]`에서 update/append API를 호출해 루틴 상태를 확정한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-04_create_routine_exercise.md`
  - `docs/user-scenario/S-05_create_routine_exercise_detail.md`
- 페이지/상태
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.tsx`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelectionView.tsx`
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.tsx`
  - `apps/web-client/src/pages/preset-selection/presetApi.ts`
  - `apps/web-client/src/pages/preset-selection/presetStore.ts`
- 테스트
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.test.tsx`
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.test.tsx`

---

## 📝 작업 항목

### 1) 편집 목록 화면(S-04)
- [ ] 편집 모드 리스트 하단에 `[새 운동 추가하기]` 버튼 추가
- [ ] 버튼 클릭 시 신규 운동 선택 흐름으로 이동(모드 플래그: `edit-add`)
- [ ] 이미 루틴에 존재하는 운동은 신규 추가 목록에서 중복 제한 정책 정의(허용/차단 중 택1)
- [ ] 운동 항목 우측 `>` 제거, `⋮` 액션 버튼으로 교체
- [ ] 항목 `⋮` 클릭 또는 롱클릭으로 액션 메뉴(`편집/삭제`) 표시
- [ ] 항목 기본 클릭은 즉시 수정 진입(편집)으로 처리
- [ ] 운동 항목 삭제 시 현재 편집 중 루틴 ViewModel/상태에서 제거

### 2) 상세 입력 화면(S-05) 분기
- [ ] `edit-update` 진입: 기존 값 prefill 유지
- [ ] `edit-add` 진입: 빈 입력 상태로 시작
- [ ] `[완료]` 클릭 시
  - [ ] `edit-update`는 `updatePresetExercise(...)` 호출
  - [ ] `edit-add`는 `appendPresetExercise(...)` 호출

### 3) Mock API/Store 확장
- [ ] `appendPresetExercise(presetId, exercise)` API 추가
- [ ] 성공 시 목록/상세 뷰모델 상태 반영
- [ ] 실패 시 사용자 동작 취소 및 에러 처리

### 4) 테스트
- [ ] 편집 목록에서 `⋮` 클릭/롱클릭 액션 메뉴 노출 테스트
- [ ] 항목 기본 클릭 시 수정 진입 테스트
- [ ] 운동 항목 삭제 액션 동작 테스트
- [ ] 편집 목록에서 `[새 운동 추가하기]` 노출/동작 테스트
- [ ] 신규 추가 진입 시 빈 입력으로 시작하는 테스트
- [ ] 완료 시 append API 호출 테스트
- [ ] append 성공 후 루틴에 새 운동이 추가되는 테스트
- [ ] 기존 update 동작 회귀 테스트

---

## ✅ 완료 기준

- [ ] 편집 모드에서 새 운동 추가 진입이 가능하다
- [ ] 편집 목록에서 `⋮`/롱클릭 액션과 기본 클릭(수정 진입) 규칙이 적용된다
- [ ] 편집 목록에서 운동 항목 삭제가 가능하다
- [ ] 신규 운동 저장 시 기존 루틴에 운동이 추가된다
- [ ] 기존 운동 수정(update) 동작이 깨지지 않는다
- [ ] mock API 호출/실패 처리 시나리오가 검증된다
- [ ] 관련 테스트가 추가/수정되고 통과한다
