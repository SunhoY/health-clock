# 개발 계획서: P-22 루틴 추가 draft 로컬 저장 및 뒤로가기 복원

---

## 📌 개발 목표

- 루틴 추가 과정(S-04/S-05/S-06)에서 입력한 모든 데이터가 로컬 draft로 유지되도록 한다.
- 사용자가 `운동 더 추가` 또는 뒤로가기 이동을 반복해도 이전 입력값이 복원되도록 한다.
- 운동별/세트별 입력 상태를 화면 재진입 시 정확히 복구한다.

---

## 🔧 변경 원칙

1. 입력 상태는 화면 로컬 state가 아니라 라우트 전환에 독립적인 draft 저장소에서 관리한다.

2. 저장 시점은 명시 액션뿐 아니라 화면 이탈/복귀 경로를 고려한다.
- `운동 더 추가`, `완료`, 뒤로가기 모두 동일 draft를 참조한다.

3. 복원은 "운동 단위"와 "세트 단위"를 함께 보장한다.
- 동일 운동 재진입 시 세트 수/세트별 중량/횟수/유산소 시간까지 복원한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-04_create_routine_exercise.md`
  - `docs/user-scenario/S-05_create_routine_exercise_detail.md`
  - `docs/user-scenario/S-02_preset_selection.md`
- 페이지/상태
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.tsx`
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.tsx`
  - `apps/web-client/src/pages/routine-title/RoutineTitle.tsx`
  - 필요 시 draft store 유틸 파일 신규 추가
- 테스트
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.test.tsx`
  - `apps/web-client/src/pages/exercise-selection/ExerciseSelection.test.tsx`
  - 필요 시 draft store 단위 테스트

---

## 📝 작업 항목

### 1) Draft 모델 정의
- [ ] 루틴 추가 draft 모델 정의
  - [ ] 선택한 운동 목록
  - [ ] 운동별 입력값(세트 수/세트별 중량/횟수/유산소 시간)
  - [ ] 마지막 편집 시점 메타데이터(선택)
- [ ] 화면에서 공통으로 사용할 read/write API 제공

### 2) 저장/복원 연결
- [ ] S-05 입력 변경 시 draft 반영
- [ ] S-05 이탈(`운동 더 추가`, 뒤로가기) 시 상태 보존
- [ ] S-04에서 동일 운동 재선택 시 기존 값 복원
- [ ] S-06 저장 완료 시 draft 정리(clear) 정책 적용

### 3) 뒤로가기 시나리오 처리
- [ ] 코어 선택 중 뒤로가기 2회 -> 가슴 운동 재선택 경로 복원 검증
- [ ] 브라우저 히스토리 이동에도 동일 동작 보장

### 4) 테스트
- [ ] 가슴 입력 -> 운동 더 추가 -> 뒤로 2회 -> 가슴 재선택 시 값 복원 테스트
- [ ] 서로 다른 운동 draft가 독립적으로 유지되는지 테스트
- [ ] 저장 완료 후 draft 초기화 테스트

---

## ✅ 완료 기준

- [ ] 루틴 추가 중 입력한 값이 로컬 draft에 저장된다
- [ ] 뒤로가기/재진입 후에도 입력값이 복원된다
- [ ] 운동별 draft가 섞이지 않고 독립 유지된다
- [ ] 완료 저장 후 draft가 의도대로 초기화된다
- [ ] 관련 테스트가 추가/수정되고 통과한다
