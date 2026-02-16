# 개발 컨벤션

## 1) 도메인 타입은 느슨하게 만들지 않는다

- `Domain Object`(예: `Preset`, `WorkoutSession`, `ExerciseDetail`)는 실제 서비스에서 항상 존재해야 하는 필드를 `optional(?)`로 두지 않는다.
- 값이 비어 있을 수 있는 단계는 도메인이 아니라 `Draft/Input/ViewModel` 타입으로 분리한다.
- 규칙:
  - 저장 완료 데이터: `required` 필드만 사용
  - 입력 중 데이터: 별도 `Draft*` 타입에서만 `optional` 허용

## 2) Optional 남용 금지

- 편의상 `?`를 붙여 타입 에러를 회피하지 않는다.
- `undefined`가 가능한 이유가 명확하지 않으면 `?` 사용 금지.
- “나중에 채울 값”은 `Draft`에서만 허용하고, 저장 시점에 `Domain`으로 변환하면서 검증한다.

## 3) API/스토어 경계에서 변환·검증 강제

- API 응답(mock 포함)은 바로 UI에 바인딩하지 않는다.
- `Mapper`를 통해 `DTO -> Domain`으로 변환하고 누락값 검증을 통과한 데이터만 상태에 넣는다.
- 검증 실패 시:
  - 조용히 fallback 하지 않는다.
  - 에러 로깅 + 안전한 실패 처리를 한다.

## 4) ViewModel 설계 원칙

- `ViewModel`도 목적별로 분리한다.
  - `PersistedViewModel`: 필수값 100% 보장
  - `DraftViewModel`: 입력 중 상태(`undefined`) 허용
- 화면 컴포넌트는 가능하면 `PersistedViewModel`만 소비한다.

## 5) TypeScript 작성 규칙

- 타입 단언(`as`)으로 검증을 우회하지 않는다.
- fixture/mock 데이터는 `satisfies`를 사용해 타입 누락을 컴파일 타임에 잡는다.

```ts
const presetFixture = {
  id: 'bench-press',
  name: '벤치프레스',
  sets: 4,
  reps: 8,
  weight: 80,
} satisfies PresetExerciseDomain;
```

## 6) PR 체크리스트(도메인 타입)

- [ ] 저장 완료 도메인 타입에 `optional`이 불필요하게 남아있지 않은가?
- [ ] Draft 타입과 Domain 타입이 분리되어 있는가?
- [ ] API(mock 포함) 응답을 Domain으로 변환/검증하는가?
- [ ] fixture/mock이 `satisfies`로 타입 검증되는가?
- [ ] “값 누락 시 0/빈문자 fallback”이 도메인을 오염시키지 않는가?
