# 개발 계획서: P-33 루틴 삭제 API 연동

---

## 📌 개발 목표

- 프리셋 선택 화면(S-02)의 루틴 삭제를 로컬 삭제/모킹 흐름에서 실제 서버 API로 전환한다.
- 삭제 성공 시 루틴 목록을 서버 기준으로 재조회해 화면과 DB 상태를 일치시킨다.
- 삭제 실패 시 사용자에게 오류를 명확히 전달하고 기존 목록을 유지한다.

---

## 🔧 변경 원칙

1. 루틴 목록의 진실 소스는 서버다.
- 삭제 성공 후 로컬 캐시를 직접 조작하기보다 `fetchPresets()` 재조회 결과로 화면을 갱신한다.

2. 삭제 식별자는 `routineId`를 사용한다.
- S-02 리스트 항목 단위 삭제이므로 루틴 ID 기준으로 API를 호출한다.

3. 삭제는 성공 응답에서만 반영한다.
- `204 No Content`를 성공 기준으로 사용하고, 실패 시 목록 상태 변경을 적용하지 않는다.

4. 사용자 소유권을 서버에서 검증한다.
- Bearer 토큰 사용자 기준으로 본인 루틴만 삭제 가능해야 한다.

---

## 🧩 대상 문서/코드

- 시나리오
  - `docs/user-scenario/S-02_preset_selection.md`
- BE
  - `apps/nest-backend/src/app/routines/routines.controller.ts`
  - `apps/nest-backend/src/app/routines/routines.service.ts`
  - `apps/nest-backend/src/app/routines/routines.repository.ts`
- FE
  - `apps/web-client/src/pages/preset-selection/presetApi.ts`
  - `apps/web-client/src/pages/preset-selection/PresetSelection.tsx`
  - `apps/web-client/src/pages/preset-selection/PresetSelection.test.tsx`

---

## 📝 작업 항목

### 1) 시나리오 정합성 반영
- [x] S-02의 `[삭제]` 동작을 `DELETE /api/routines/:routineId` 기준으로 명시
- [x] 삭제 성공/실패 시 화면 반응(재조회/오류 노출) 규칙 정의

### 2) 백엔드 삭제 API 추가
- [ ] 엔드포인트 확인/보강: `DELETE /api/routines/:routineId`
- [ ] Guard 적용: Bearer 토큰 사용자만 접근 가능
- [ ] `routineId + userId` 소유권 검증 후 삭제
- [ ] 삭제 대상 미존재 또는 권한 불일치 시 `404` 처리
- [ ] 성공 시 `204 No Content` 반환

### 3) 프론트 루틴 삭제 연동
- [ ] `deletePreset` 호출 후 `fetchPresets` 재조회 흐름으로 정리
- [ ] S-02 삭제 성공 시 목록 즉시 갱신
- [ ] 삭제 중 중복 클릭 방지(메뉴/확인 버튼 disable) 적용
- [ ] 삭제 실패 문구 노출(예: `루틴 삭제에 실패했습니다.`)

### 4) 테스트 보강
- [ ] BE controller/service/repository 삭제 성공/실패/권한 케이스 보강
- [ ] FE 삭제 성공 시 재조회 기반 목록 갱신 검증
- [ ] FE 삭제 실패 시 목록 유지 + 오류 처리 검증

---

## ✅ 완료 기준

- [ ] S-02 루틴 삭제가 서버 API를 통해 동작한다
- [ ] 본인 루틴만 삭제 가능하다
- [ ] 삭제 성공 시 목록에서 제거되고 새로고침 후에도 반영된다
- [ ] 삭제 실패 시 목록은 유지되고 사용자 오류 피드백이 노출된다
- [ ] 관련 테스트가 통과한다

---

## 📎 API 예시

`DELETE /api/routines/routine-123`

- 성공: `204 No Content`
- 실패: `404 Not Found` (`Routine not found.`)
