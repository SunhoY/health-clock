# 개발 계획서: P-24 프리셋 삭제 모킹 API 및 운동 단위 편집 플로우

---

## 📌 개발 목표

- 프리셋 삭제 시 서버가 없는 환경에서도 API 호출부를 모킹해 실제 연동 구조와 유사하게 동작시킨다.
- 삭제 성공 시 로컬 상태에서 제거하고 refetch(모킹) 결과를 기준으로 목록을 다시 렌더링한다.
- 프리셋 편집 시 "이전 작성 화면으로 단순 이동"이 아니라, 루틴에 포함된 운동 중 수정 대상을 먼저 선택하게 한다.
- 운동 선택 후에는 기존 설정값을 미리 채운 상태로 세부 입력 화면(S-05)에서 수정 가능해야 한다.
- 편집 모드에서 모든 입력값은 루틴 ViewModel에 반영되어야 하며, `[완료]` 시 업데이트 API(모킹)를 호출한 뒤 상태를 최종 갱신해야 한다.

---

## 🔧 변경 원칙

1. 삭제 플로우는 "API 호출 -> 응답 처리 -> 재조회" 구조를 유지한다.
- 당장은 mock API로 대체하되, 추후 실제 API로 교체하기 쉬운 인터페이스를 사용한다.

2. 편집 플로우는 루틴 단위가 아닌 운동 단위로 진입한다.
- 편집 대상 운동을 먼저 고르게 해서 사용자가 의도한 수정 포인트를 명확히 한다.

3. 기존 생성 플로우와 편집 플로우를 명시적으로 분리한다.
- 화면 재사용은 하되 `mode=create | edit`에 따라 데이터 소스와 초기값 로딩 방식을 분기한다.

4. 편집 모드의 액션 라벨은 목적이 명확해야 한다.
- 생성 모드의 `[운동 더 추가]`와 구분해, 편집 모드에서는 `[다른 운동 수정하기]`를 사용한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-02_preset_selection.md`
  - `docs/user-scenario/S-04_create_routine_exercise.md`
  - `docs/user-scenario/S-05_create_routine_exercise_detail.md`
- 페이지/상태
  - `apps/web-client/src/pages/preset-selection/PresetSelection.tsx`
  - `apps/web-client/src/pages/preset-selection/PresetSelectionView.tsx`
  - `apps/web-client/src/pages/preset-selection/presetStore.ts`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.tsx`
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.tsx`
- 신규 계층(필요 시)
  - `apps/web-client/src/pages/preset-selection/presetApi.ts` (mock API 인터페이스)
- 테스트
  - `apps/web-client/src/pages/preset-selection/PresetSelection.test.tsx`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.test.tsx`
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.test.tsx`

---

## 📝 작업 항목

### 1) 삭제: API 모킹 + refetch 구조
- [ ] `deletePreset(presetId)` mock API 함수 정의
- [ ] 삭제 확인 후 mock API 호출
- [ ] 응답 성공 시 로컬 store 제거
- [ ] `fetchPresets()` mock API로 목록 재조회 후 화면 상태 갱신
- [ ] 실패 응답 시 목록 변경 없이 에러 처리

### 2) 편집: 운동 선택 진입 단계
- [ ] S-02 `[편집]` 클릭 시 `edit` 모드와 `presetId` 전달
- [ ] S-04 편집 모드에서 선택 루틴의 운동 목록 표시
- [ ] 운동 항목 탭 시 S-05로 이동하면서 해당 운동의 기존 설정값 전달

### 3) 편집: 기존 값 로딩 및 부분 수정 저장
- [ ] S-05 편집 모드 초기값 바인딩
- [ ] S-05 편집 모드 Secondary 버튼 라벨을 `[다른 운동 수정하기]`로 분기
- [ ] 수정 후 저장 시 선택 운동만 갱신하고 루틴 나머지 운동은 유지
- [ ] 중량/횟수/시간 등 편집 입력값을 루틴 ViewModel에 즉시 반영
- [ ] `[완료]` 클릭 시 `updatePreset(presetId, viewModel)` mock API 호출 후 성공 응답 기준으로 로컬 상태 갱신
- [ ] 생성 모드 동작과 충돌 없는지 회귀 확인

### 4) 테스트
- [ ] 삭제 성공 시 mock API 호출 -> 상태 제거 -> 재조회 렌더링 테스트
- [ ] 삭제 실패 시 목록 유지 테스트
- [ ] 편집 모드에서 운동 목록 노출 테스트
- [ ] 특정 운동 진입 시 기존 값 prefill 테스트
- [ ] 편집 모드에서 `[다른 운동 수정하기]` 버튼 노출/동작 테스트
- [ ] 편집 입력이 ViewModel에 반영되는 테스트
- [ ] 저장 시 해당 운동만 변경되는 테스트
- [ ] `[완료]` 시 mock update API 호출 및 상태 갱신 테스트

---

## ✅ 완료 기준

- [ ] 삭제가 mock API + refetch 패턴으로 동작한다
- [ ] 삭제 성공 시 목록에서 제거되고, 실패 시 유지된다
- [ ] 편집 진입 시 루틴 내 운동 선택 단계를 거친다
- [ ] 선택한 운동의 기존 값이 S-05에 미리 채워진다
- [ ] 편집 모드에서 `[다른 운동 수정하기]` 라벨/동작이 분리 적용된다
- [ ] 편집 입력값이 ViewModel에 반영된다
- [ ] 수정 저장 시 대상 운동만 갱신된다
- [ ] `[완료]` 시 mock update API 호출 후 상태가 갱신된다
- [ ] 관련 테스트가 추가/수정되고 통과한다
