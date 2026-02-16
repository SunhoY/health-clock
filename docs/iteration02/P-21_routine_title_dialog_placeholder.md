# 개발 계획서: P-21 루틴 제목 다이얼로그 전환 및 placeholder 입력 방식

---

## 📌 개발 목표

- `/routine-title`를 다이얼로그 UX로 고정해, 운동 상세 화면 완료 흐름을 끊지 않는다.
- 제목 입력 필드의 초기 value 자동 채움을 제거하고 placeholder 기반 입력으로 전환한다.
- "이상한 기본값이 입력되어 보이는" 문제를 제거하고 사용자가 의도적으로 제목을 입력하게 한다.

---

## 🔧 변경 원칙

1. 입력값과 안내값을 분리한다.
- 추천 제목은 value가 아니라 placeholder로만 제공한다.

2. 완료 액션의 목적은 제목 입력 다이얼로그 진입이다.
- S-05 `[완료]`는 저장 직행이 아니라 S-06 다이얼로그 표시 단계다.

3. 유효성 검증은 실제 입력값 기준으로만 동작한다.
- placeholder 텍스트는 검증/저장 대상이 아니다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-06_routine_title.md`
- 페이지
  - `apps/web-client/src/pages/routine-title/RoutineTitle.tsx`
  - `apps/web-client/src/pages/routine-title/RoutineTitleView.tsx`
- 필요 시 라우팅 흐름 확인
  - `apps/web-client/src/pages/exercise-detail/ExerciseDetail.tsx`
- 테스트
  - `apps/web-client/src/pages/routine-title/RoutineTitle.test.tsx`
  - `apps/web-client/src/pages/routine-title/RoutineTitleView.test.tsx`

---

## 📝 작업 항목

### 1) 입력 상태 초기화 정책 변경
- [ ] 기본 제목 자동 주입(`value`) 제거
- [ ] `form.title` 초기값을 빈 문자열로 유지
- [ ] 추천 문구는 placeholder로 내려주기

### 2) 다이얼로그 UX 명확화
- [ ] `/routine-title` 진입 시 제목 입력 다이얼로그가 즉시 보이도록 유지
- [ ] 완료 버튼 플로우와 S-06 다이얼로그의 연결 의도(입력 단계) 점검

### 3) 유효성/버튼 상태 조정
- [ ] 빈 값에서는 저장 비활성 또는 저장 차단 동작 유지
- [ ] 사용자 입력 이후에만 유효성 문구 노출되도록 개선 여부 검토

### 4) 테스트 보강
- [ ] 초기 렌더 시 input value가 비어 있고 placeholder만 보이는지 검증
- [ ] 기본값 텍스트가 input value로 들어가지 않는지 검증
- [ ] 저장/취소 라우팅 회귀 테스트

---

## ✅ 완료 기준

- [ ] `/routine-title`가 다이얼로그 UX로 동작한다
- [ ] 제목 입력 필드 기본값(value)은 비어 있고 placeholder만 노출된다
- [ ] "기본값이 입력되어 보이는" 현상이 사라진다
- [ ] 관련 테스트가 추가/수정되고 통과한다
