# 개발 계획서: P-03 루틴 만들기 - 부위 선택 화면

---

## 📌 개발 목표

- 사용자가 새로운 운동 루틴을 생성할 때 첫 번째 단계인 운동 부위 선택 기능 구현
- 직관적이고 사용하기 쉬운 부위 선택 인터페이스 제공
- 선택된 부위 정보를 다음 단계로 전달하는 상태 관리 구현

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `CreateRoutineView`: 루틴 생성 화면 전체 레이아웃
- `BodyPartGrid`: 운동 부위 버튼들의 그리드 레이아웃
- `BodyPartButton`: 개별 운동 부위 선택 버튼
- `PageHeader`: 제목과 서브타이틀을 포함한 헤더

### Container Components
- `CreateRoutineContainer`: 부위 선택 로직 및 다음 단계 라우팅 담당

---

## ⚙️ 필요한 기능 및 상태 관리

### 상태 관리
- 선택된 운동 부위
- 루틴 생성 진행 상태
- 임시 루틴 데이터 (전역 상태)

### 주요 기능
- 운동 부위 목록 표시
- 부위 선택 시 다음 화면으로 라우팅
- 루틴 생성 컨텍스트에 선택된 부위 저장

### 데이터 모델
```typescript
interface BodyPart {
  id: string;
  name: string;
  icon?: string;
  exercises: string[]; // 해당 부위의 운동 목록
}

interface RoutineCreationState {
  selectedBodyPart?: string;
  exercises: Exercise[];
  title?: string;
}

const BODY_PARTS: BodyPart[] = [
  { id: 'chest', name: '가슴', exercises: ['벤치프레스', '인클라인 벤치프레스', '덤벨 플라이', '푸쉬업'] },
  { id: 'back', name: '등', exercises: ['바벨 로우', '렛풀다운', '데드리프트', '시티드 로우'] },
  { id: 'legs', name: '하체', exercises: ['스쿼트', '레그프레스', '레그컬', '런지'] },
  { id: 'shoulders', name: '어깨', exercises: ['숄더프레스', '사이드 레터럴 레이즈', '리어 델트 플라이'] },
  { id: 'arms', name: '팔', exercises: ['바이셉 컬', '트라이셉 익스텐션', '해머 컬'] },
  { id: 'abs', name: '복부', exercises: ['크런치', '플랭크', '레그레이즈', '러시안 트위스트'] },
  { id: 'calves', name: '종아리', exercises: ['카프 레이즈', '시티드 카프 레이즈'] },
  { id: 'fullbody', name: '전신', exercises: ['버피', '마운틴 클라이머', '스러스터'] },
  { id: 'cardio', name: '유산소', exercises: ['러닝머신', '싸이클', '스텝퍼', '줄넘기'] }
];
```

---

## 🧪 테스트 계획

### Unit Tests (`CreateRoutineView.test.tsx`)
- [ ] 페이지 제목과 서브타이틀이 올바르게 표시
- [ ] 모든 운동 부위 버튼이 렌더링
- [ ] 부위 버튼 클릭 시 콜백 함수 호출
- [ ] 접근성 속성이 올바르게 설정

### Unit Tests (`BodyPartButton.test.tsx`)
- [ ] 부위 이름이 올바르게 표시
- [ ] 클릭 이벤트가 올바르게 처리
- [ ] 선택된 상태 스타일링 적용
- [ ] 키보드 네비게이션 지원

### Integration Tests (`CreateRoutineContainer.test.tsx`)
- [ ] 부위 선택 시 상태가 올바르게 업데이트
- [ ] 부위 선택 후 다음 화면으로 라우팅
- [ ] 루틴 생성 컨텍스트에 데이터 저장

---

## 📚 스토리북 계획

### Stories (`CreateRoutineView.stories.tsx`)
- [ ] Default: 기본 부위 선택 화면
- [ ] WithSelection: 부위가 선택된 상태
- [ ] Loading: 로딩 상태 (필요한 경우)

### Stories (`BodyPartButton.stories.tsx`)
- [ ] Default: 기본 부위 버튼
- [ ] Selected: 선택된 상태의 버튼
- [ ] WithIcon: 아이콘이 있는 버튼
- [ ] Disabled: 비활성화된 버튼

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 모델 및 상수 정의
- [ ] 운동 부위 관련 타입 정의
- [ ] 운동 부위 목록 상수 정의
- [ ] 루틴 생성 상태 타입 정의

### 2단계: Presentational Components 구현
- [ ] `BodyPartButton` 컴포넌트 구현
- [ ] `BodyPartGrid` 컴포넌트 구현
- [ ] `PageHeader` 컴포넌트 구현
- [ ] `CreateRoutineView` 전체 레이아웃 구현

### 3단계: 테스트 작성
- [ ] `BodyPartButton` 단위 테스트 작성
- [ ] `CreateRoutineView` 단위 테스트 작성
- [ ] 접근성 테스트 포함

### 4단계: 스토리북 설정
- [ ] `BodyPartButton` 스토리 작성
- [ ] `CreateRoutineView` 스토리 작성
- [ ] 인터랙션 테스트 추가

### 5단계: 상태 관리 구현
- [ ] 루틴 생성 컨텍스트 구현
- [ ] 상태 관리 훅 구현
- [ ] 데이터 지속성 로직 구현

### 6단계: Container Component 구현
- [ ] `CreateRoutineContainer` 구현
- [ ] 부위 선택 로직 구현
- [ ] 라우팅 로직 구현

### 7단계: 통합 테스트
- [ ] Container 컴포넌트 테스트 작성
- [ ] 상태 관리 테스트
- [ ] 라우팅 테스트

### 8단계: 스타일링 및 UX 개선
- [ ] 반응형 그리드 레이아웃 구현
- [ ] 호버 및 포커스 상태 스타일링
- [ ] 선택 애니메이션 효과 추가
- [ ] 접근성 개선 (키보드 네비게이션, 스크린 리더 지원)

---

## 🔧 기술적 고려사항

### 의존성
- React Context API 또는 상태 관리 라이브러리
- React Router for 라우팅
- CSS Grid 또는 Flexbox for 레이아웃

### 파일 구조
```
src/
  pages/
    create-routine/
      components/
        CreateRoutineView.tsx
        CreateRoutineView.test.tsx
        CreateRoutineView.stories.tsx
        BodyPartGrid.tsx
        BodyPartButton.tsx
        BodyPartButton.test.tsx
        BodyPartButton.stories.tsx
        PageHeader.tsx
      containers/
        CreateRoutineContainer.tsx
        CreateRoutineContainer.test.tsx
      context/
        RoutineCreationContext.tsx
        RoutineCreationContext.test.tsx
      constants/
        bodyParts.ts
      index.ts
```

### 접근성 고려사항
- ARIA 레이블 및 역할 정의
- 키보드 네비게이션 지원
- 포커스 관리
- 스크린 리더 지원

### 성능 최적화
- React.memo를 활용한 불필요한 리렌더링 방지
- 부위 목록의 메모이제이션

---

## ✅ 완료 기준

- [ ] 모든 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 9개 운동 부위 버튼이 모두 표시
- [ ] 부위 선택 시 다음 화면으로 정상 이동
- [ ] 선택된 부위 정보가 올바르게 전달
- [ ] 반응형 그리드 레이아웃 구현
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 키보드 네비게이션 완전 지원
- [ ] 부위 선택 애니메이션 구현 