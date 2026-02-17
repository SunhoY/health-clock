# 개발 계획서: P-28 저장된 루틴 목록 서버 API 연동

---

## 📌 개발 목표

- 프리셋 선택 화면(S-02)의 루틴 목록 데이터 소스를 로컬 mock/store에서 실제 서버 API로 전환한다.
- 화면 진입 시 `GET /api/routines` 응답을 기준으로 목록을 렌더링한다.
- API 응답을 Domain/ViewModel로 변환해 UI에 반영하고, 실패 시 안전하게 처리한다.

---

## 🔧 변경 원칙

1. 목록 조회는 서버 단일 소스 기준으로 동작한다.
- `fetchPresets()`는 서버 호출을 기본으로 하고, 성공 응답만 화면 상태에 반영한다.

2. API 경계에서 매핑/검증을 수행한다.
- DTO를 바로 UI에 바인딩하지 않고 Mapper를 통해 `PresetItem`으로 변환한다.

3. 변경 범위는 "목록 조회"에 집중한다.
- 생성/수정/삭제 API는 별도 과제로 분리하고, 본 계획에서는 조회 흐름을 우선 완성한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-02_preset_selection.md`
- FE
  - `apps/web-client/src/pages/preset-selection/presetApi.ts`
  - `apps/web-client/src/pages/preset-selection/PresetSelection.tsx`
  - `apps/web-client/src/pages/preset-selection/PresetSelection.test.tsx`
- BE
  - `apps/nest-backend/src/app/app.module.ts`
  - `apps/nest-backend/src/app/routines/routines.module.ts` (신규)
  - `apps/nest-backend/src/app/routines/routines.controller.ts` (신규)
  - `apps/nest-backend/src/app/routines/routines.service.ts` (신규)
  - `apps/nest-backend/src/app/routines/routines.repository.ts` (신규)

---

## 📝 작업 항목

### 1) 시나리오 정합성 반영
- [ ] S-02 문서의 "mock/모킹" 표현 제거
- [ ] 목록 조회를 `GET /api/routines` 기반으로 명시

### 2) 백엔드 조회 API 구현
- [ ] `GET /api/routines` 엔드포인트 추가
- [ ] DB에서 사용자 루틴 목록 조회(최신 생성순)
- [ ] 응답 스키마 정의 (`id`, `title`, `exerciseCount`, `createdAt`, `lastUsedAt`)
- [ ] DB 연결 실패/조회 실패 시 5xx 에러 처리

### 3) 프론트 API 연동
- [ ] `fetchPresets()`를 서버 호출로 교체
- [ ] 서버 DTO -> `PresetItem` 매핑 함수 추가
- [ ] 조회 실패 시 에러 로그/기본 빈 목록 처리
- [ ] 기존 화면 상호작용(선택/이동) 회귀 확인

### 4) 테스트 보강
- [ ] BE: routines controller/service 단위 테스트 추가
- [ ] FE: 목록 조회를 `fetch`/API mock 기반으로 변경
- [ ] FE: 조회 실패 케이스 테스트 추가

---

## ✅ 완료 기준

- [ ] S-02 문서가 서버 조회 기준으로 최신화되어 있다
- [ ] `GET /api/routines` 호출 시 저장된 루틴 목록을 반환한다
- [ ] 프리셋 선택 화면이 서버 응답으로 목록을 렌더링한다
- [ ] API 실패 시 앱이 깨지지 않고 빈 상태를 유지한다
- [ ] 관련 테스트가 통과한다

---

## 📎 API 응답 예시

```json
[
  {
    "id": "routine-uuid",
    "title": "상체 루틴 A",
    "exerciseCount": 5,
    "createdAt": "2026-02-17T10:00:00.000Z",
    "lastUsedAt": "2026-02-16T18:10:00.000Z"
  }
]
```
