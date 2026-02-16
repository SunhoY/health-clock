# 개발 계획서: P-16 운동 완료 후 요약 화면 간소화

---

## 📌 개발 목표

- 운동 완료 직후 화면(S-08)을 반복 사용에 적합한 간소 UI로 전환한다.
- 핵심 정보는 `운동 시간`과 `완료한 운동 목록`만 제공한다.
- 상세 정보는 기본 노출하지 않고 `[상세 요약 보기]`로 선택 진입하도록 분리한다.

---

## 🔧 변경 원칙

1. 기본은 짧고 직관적이어야 한다.
- 완료 직후 문구는 `운동 끝!`처럼 짧은 고정 메시지를 사용한다.
- `오늘의 운동요약` 같은 제목성 문구, 감성 카피는 제거한다.

2. 의미 낮은 집계는 제외한다.
- `총중량`, `총 세트수`는 기본 화면에서 제거한다.

3. 상세 정보는 선택적으로 본다.
- 사용자가 필요할 때만 상세 화면(S-09)으로 진입한다.

---

## 🧩 대상 컴포넌트

- `apps/web-client/src/pages/workout-complete/WorkoutComplete.tsx`
- `apps/web-client/src/pages/workout-complete/WorkoutCompleteView.tsx`
- `apps/web-client/src/pages/workout-summary/WorkoutSummary.tsx`
- `apps/web-client/src/pages/workout-summary/WorkoutSummaryView.tsx`
- 관련 테스트 파일
  - `apps/web-client/src/pages/workout-complete/WorkoutComplete.test.tsx`
  - `apps/web-client/src/pages/workout-complete/WorkoutCompleteView.test.tsx`
  - `apps/web-client/src/pages/workout-summary/WorkoutSummary.test.tsx`
  - `apps/web-client/src/pages/workout-summary/WorkoutSummaryView.test.tsx`

---

## 📝 작업 항목

### 1) S-08(운동 완료) UI 간소화
- [ ] 상단 메시지를 고정 문구 `운동 끝!`으로 변경
- [ ] 기본 요약 정보는 아래 2개만 표시
  - [ ] 운동 시간
  - [ ] 완료한 운동 목록
- [ ] `총중량`, `총 세트수` 노출 제거
- [ ] 불필요한 제목/감성 문구 제거

### 2) 버튼/네비게이션 재정의
- [ ] Primary: `[운동 마치기]` 클릭 시 홈(S-01) 이동
- [ ] Secondary: `[상세 요약 보기]` 클릭 시 S-09 이동
- [ ] 기존 `다른 운동` 버튼 제거(또는 정책에 맞게 대체)

### 3) S-09 역할 명확화
- [ ] S-09를 선택 진입형 상세 요약 화면으로 유지/정리
- [ ] S-08과 중복되는 기본 정보는 최소화하고 상세 리스트 중심으로 구성

### 4) 테스트 업데이트
- [ ] 정적 문구/스타일 검증은 최소화(테스트 가이드 준수)
- [ ] `WorkoutComplete.test.tsx`
  - [ ] S-08에서 운동 시간/운동 목록 노출 검증
  - [ ] `총중량`, `총 세트수` 미노출 검증
  - [ ] 버튼 클릭 시 라우팅 분기 검증
- [ ] `WorkoutSummary.test.tsx`
  - [ ] S-08에서 상세 진입 시 정상 렌더링 검증

---

## ✅ 완료 기준

- [ ] 운동 완료 직후 화면에서 핵심 정보(운동 시간, 완료 운동 목록)만 보인다
- [ ] 총중량/총세트수는 기본 화면에서 제거된다
- [ ] 사용자는 `운동 마치기` 또는 `상세 요약 보기` 중 하나로 즉시 선택 가능하다
- [ ] 관련 테스트가 업데이트되고 통과한다
