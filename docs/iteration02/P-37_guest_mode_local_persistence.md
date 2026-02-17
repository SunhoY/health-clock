# 개발 계획서: P-37 게스트 모드 로컬 영속화

---

## 📌 개발 목표

- 로그인 없이도 게스트 모드로 루틴 생성/편집/삭제/조회가 가능해야 한다.
- 운동 부위/운동 카탈로그 같은 메타 정보는 게스트 모드에서도 서버 API 조회를 유지한다.
- 사용자별 영속 데이터(루틴 목록, 루틴별 운동/세트 설정)는 게스트 모드에서 로컬 스토리지에 저장한다.

---

## 🔧 변경 원칙

1. 실행 모드를 명시적으로 분리한다.
- `authenticated`와 `guest`를 세션 상태로 구분하고, 각 화면/API 호출에서 동일한 모드 기준을 사용한다.

2. 메타 정보는 단일 소스를 서버로 유지한다.
- 운동 부위/운동 목록은 모드와 무관하게 서버 API를 사용해 데이터 정합성을 확보한다.

3. 사용자 루틴 데이터는 모드별 저장소를 분기한다.
- 인증 모드: 서버 DB API
- 게스트 모드: 로컬 스토리지

4. 화면 플로우는 동일하게 유지한다.
- S-02~S-06 사용자 동선은 동일하게 두고, 데이터 소스만 모드에 따라 분기한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-01_home.md`
  - `docs/user-scenario/S-02_preset_selection.md`
  - `docs/user-scenario/S-03_create_routine.md`
  - `docs/user-scenario/S-04_create_routine_exercise.md`
  - `docs/user-scenario/S-05_create_routine_exercise_detail.md`
  - `docs/user-scenario/S-06_routine_title.md`
- FE
  - `apps/web-client/src/pages/home/Home.tsx`
  - `apps/web-client/src/pages/preset-selection/presetApi.ts`
  - `apps/web-client/src/pages/preset-selection/presetStore.ts`
  - `apps/web-client/src/pages/create-routine/*`
  - `apps/web-client/src/pages/exercise-selection/*`
  - `apps/web-client/src/pages/exercise-detail/*`
- BE
  - `apps/nest-backend/src/app/exercises/*` (게스트 접근 가능 메타 API 유지)
  - `apps/nest-backend/src/app/routines/*` (인증 사용자 전용 유지)

---

## 📝 작업 항목

### 1) 실행 모드/세션 정의
- [ ] 앱 공통 세션 모델에 `guest` 모드 추가
- [ ] `[GUEST로 시작하기]` 클릭 시 게스트 모드 저장
- [ ] 로그인 성공 시 인증 모드로 전환

### 2) S-02 루틴 목록 데이터 소스 분기
- [ ] 인증 모드: `GET /api/routines` 유지
- [ ] 게스트 모드: 로컬 스토리지 루틴 조회
- [ ] S-02 복귀 시 모드별 저장소 재조회 반영

### 3) 루틴 생성/편집/삭제 로직 분기
- [ ] 게스트 모드 루틴 생성: 로컬 저장
- [ ] 게스트 모드 루틴 편집(운동/세트): 로컬 갱신
- [ ] 게스트 모드 루틴 삭제/루틴 내 운동 삭제: 로컬 삭제
- [ ] 인증 모드 기존 API 경로 동작 회귀 확인

### 4) 메타 정보 API 유지
- [ ] 부위/운동 목록 조회 API가 게스트 모드에서도 동작하는지 확인
- [ ] 게스트 모드에서도 S-03/S-04 메타 조회는 서버 API로 통일

### 5) 테스트 보강
- [ ] 홈에서 게스트 모드 진입 테스트
- [ ] 게스트 모드 루틴 생성/목록 반영 테스트
- [ ] 게스트 모드 루틴 편집/삭제 테스트
- [ ] 게스트 모드 루틴 내 운동 편집/삭제 테스트
- [ ] 인증 모드 API 연동 회귀 테스트

---

## ✅ 완료 기준

- [ ] 로그인 없이 게스트 모드로 루틴 전체 플로우가 동작한다
- [ ] 운동 부위/운동 목록은 게스트 모드에서도 서버 API로 조회된다
- [ ] 게스트 루틴/세트 데이터가 로컬 스토리지에 영속 저장된다
- [ ] 인증 모드 서버 저장 플로우가 깨지지 않는다
- [ ] 관련 테스트가 통과한다
