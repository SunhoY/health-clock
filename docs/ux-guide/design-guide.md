# Design Guide (Mobile-First)

## 목적
이 문서는 Health Clock의 화면별 시각 스타일 기준을 정의한다.

## 액션 버튼 규칙
- 편집/삭제 트리거는 `LongPressActionButton` 컴포넌트를 사용한다.
- 롱프레스는 `0.7초` 이상 유지 시 실행한다.
- `...` 액션 버튼 규칙:
  - 아이콘은 `세로형`(vertical ellipsis)으로 사용한다.
  - 멀티라인 카드에서는 버튼을 `우상단`에 배치한다.
  - 싱글라인 카드에서는 버튼을 `상하 가운데` 정렬한다.
  - `...` 버튼은 `배경(background)` 또는 `테두리(border)`를 두지 않는다.
