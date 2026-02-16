# 개발 계획서: P-17 운동 상세 요약(S-09) 부위별 ViewModel 도입

---

## 📌 개발 목표

- S-09 화면을 부위 중심 상세 요약 구조로 개편한다.
- 오늘 수행한 부위만 출력하고, 부위별로 필요한 지표만 표시한다.
- 화면 렌더링은 `WorkoutDetailSummaryViewModel`로 통일해 데이터/표시 규칙을 분리한다.

---

## 🔧 변경 원칙

1. 부위별 지표는 최소/명확하게 제공한다.
- 유산소: 소모 칼로리
- 상체/하체/코어: 총 세트수, 최대 중량

2. 수행하지 않은 부위는 숨긴다.
- 빈 카드/0값 카드를 노출하지 않는다.

3. 확장 가능한 ViewModel 구조를 만든다.
- 추후 DB 기반 지표(예: PR, 추세)를 붙일 수 있도록 타입을 명확히 분리한다.

---

## 🧩 대상 컴포넌트

- `apps/web-client/src/types/exercise.ts`
- `apps/web-client/src/pages/workout-summary/WorkoutSummary.tsx`
- `apps/web-client/src/pages/workout-summary/WorkoutSummaryView.tsx`
- 관련 테스트/스토리
  - `apps/web-client/src/pages/workout-summary/WorkoutSummary.test.tsx`
  - `apps/web-client/src/pages/workout-summary/WorkoutSummaryView.test.tsx`
  - `apps/web-client/src/pages/workout-summary/WorkoutSummaryView.stories.tsx`

---

## 📝 작업 항목

### 1) ViewModel 정의
- [ ] `WorkoutDetailSummaryViewModel` 타입 추가
- [ ] 부위 enum/타입 정의 (`cardio | upper | lower | core`)
- [ ] 부위별 지표 타입 분리
  - [ ] 유산소: `caloriesBurned`
  - [ ] 근력: `totalSets`, `maxWeight`

### 2) 데이터 집계/매핑 로직
- [ ] 기존 집계 데이터에서 부위 분류 매핑 규칙 정의
  - [ ] 상체: chest/back/shoulders/arms
  - [ ] 하체: legs/calves
  - [ ] 코어: abs
  - [ ] 유산소: cardio
- [ ] 부위별 요약값 계산
  - [ ] 유산소 칼로리 계산
  - [ ] 근력 부위 총 세트수/최대 중량 계산
- [ ] 오늘 수행한 부위 목록(`todayBodyParts`) 생성

### 3) 화면 렌더링 변경
- [ ] 상단 `오늘 운동 부위` 영역 추가
- [ ] 부위 카드 조건부 렌더링 적용
- [ ] 수행하지 않은 부위 카드 미출력 처리
- [ ] 기존 과다 통계/리스트 중심 UI 제거 또는 상세 옵션으로 분리

### 4) 테스트 업데이트
- [ ] `WorkoutSummaryView.test.tsx`
  - [ ] 상단 부위 목록 렌더링 검증
  - [ ] 유산소 카드에 칼로리 표시 검증
  - [ ] 상체/하체/코어 카드에 세트수/최대중량 표시 검증
  - [ ] 미수행 부위 미출력 검증
- [ ] `WorkoutSummary.test.tsx`
  - [ ] location state 기반 completionData 매핑 후 부위별 출력 검증
  - [ ] 혼합 운동/단일 부위 케이스 검증

---

## ✅ 완료 기준

- [ ] S-09에서 `오늘 운동 부위`가 상단에 표시된다
- [ ] 유산소/상체/하체/코어 중 수행한 부위만 출력된다
- [ ] 유산소는 칼로리, 근력은 총 세트수/최대 중량이 표시된다
- [ ] ViewModel 기반 렌더링과 테스트가 모두 통과한다
