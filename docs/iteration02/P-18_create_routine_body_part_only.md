# 개발 계획서: P-18 루틴 만들기 화면 부위 선택 전용 단순화

---

## 📌 개발 목표

- `/create-routine` 화면을 부위 선택 전용으로 단순화한다.
- 사용자는 부위만 선택하고 즉시 다음 단계(S-04)로 이동한다.
- 과한 보조 정보(운동 개수/운동 예시 목록)를 제거해 의사결정 부담을 줄인다.

---

## 🔧 변경 원칙

1. 첫 화면에서 선택은 하나만 요구한다.
- 부위 선택 외 입력/비교 정보는 노출하지 않는다.

2. 카피와 라벨은 짧고 명확하게 유지한다.
- 부위명은 `코어(복부)`처럼 이해 가능한 병기 표기를 사용한다.

3. 정보는 다음 화면으로 넘긴다.
- 세부 운동 정보는 S-04에서만 노출한다.

---

## 🧩 대상 컴포넌트

- `apps/web-client/src/pages/create-routine/CreateRoutine.tsx`
- `apps/web-client/src/pages/create-routine/CreateRoutineView.tsx`
- 관련 테스트/스토리
  - `apps/web-client/src/pages/create-routine/CreateRoutine.test.tsx`
  - `apps/web-client/src/pages/create-routine/CreateRoutineView.test.tsx`
  - 필요 시 `apps/web-client/src/pages/create-routine/CreateRoutineView.stories.tsx`

---

## 📝 작업 항목

### 1) UI 단순화
- [ ] 부위 카드에서 운동 개수 표시 제거
- [ ] 부위 카드에서 운동 예시 목록 제거
- [ ] 부위명만 보이는 버튼형 카드로 구성

### 2) 네이밍/데이터 정리
- [ ] 부위 라벨 `복부`를 `코어(복부)`로 변경
- [ ] 부위 ID(`abs`)는 기존 라우팅 호환을 위해 유지
- [ ] 부위 누락 여부 점검 및 MVP 범위 명시

### 3) 상호작용/라우팅 유지
- [ ] 부위 클릭 시 `/exercise-selection/:bodyPart` 이동 유지
- [ ] 선택 로그 등 불필요한 디버그 출력 제거

### 4) 테스트 업데이트
- [ ] 정적 스타일/하드코딩 문구 검증 최소화(테스트 가이드 준수)
- [ ] 부위 버튼 렌더링 및 클릭 라우팅 검증 유지
- [ ] 제거된 보조 정보(운동 개수/목록) 관련 테스트 정리

---

## ✅ 완료 기준

- [ ] `/create-routine` 화면이 부위 선택 전용으로 동작한다
- [ ] 부위 선택 시 즉시 다음 단계로 이동한다
- [ ] `코어(복부)` 명칭이 반영된다
- [ ] 관련 테스트가 업데이트되고 통과한다
