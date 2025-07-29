# 개발 계획서: P-03 루틴 만들기 - 부위 선택 화면

---

## 📌 개발 목표

- 사용자가 새로운 운동 루틴을 생성할 때 첫 번째 단계인 운동 부위 선택 기능 구현
- 직관적이고 사용하기 쉬운 부위 선택 인터페이스 제공
- 선택된 부위 정보를 다음 단계로 전달하는 기능 구현

---

## 🏗️ 컴포넌트 구조

### Presentational Components
- `CreateRoutineView`: 루틴 생성 화면 전체 레이아웃 (부위 선택 그리드 포함)

### Controller Components
- `CreateRoutine`: 부위 선택 로직 및 다음 단계 라우팅 담당

---

## ⚙️ 필요한 기능

### 주요 기능
- 운동 부위 목록 표시
- 부위 선택 시 다음 화면으로 라우팅
- 프리셋 선택 화면에서 새로운 루틴 만들기 버튼 클릭 시 이 화면으로 라우팅

### 데이터 모델
```typescript
interface BodyPart {
  id: string;
  name: string;
  icon?: string;
  exercises: string[]; // 해당 부위의 운동 목록
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

### Unit Tests (`CreateRoutine.test.tsx`)
- [ ] 부위 선택 시 콘솔에 로그 출력
- [ ] 부위 선택 후 다음 화면으로 라우팅 준비

---

## 📚 스토리북 계획

### Stories (`CreateRoutineView.stories.tsx`)
- [ ] Default: 기본 부위 선택 화면

### Stories (`CreateRoutine.stories.tsx`)
- [ ] Default: 기본 부위 선택 화면 (라우터 컨텍스트 포함)

---

## 📝 개발 순서 및 할 일 목록

### 1단계: 데이터 모델 및 상수 정의
- [ ] 운동 부위 관련 타입 정의
- [ ] 운동 부위 목록 상수 정의

### 2단계: Presentational Component 구현
- [ ] `CreateRoutineView` 컴포넌트 구현 (부위 선택 그리드 포함)

### 3단계: 테스트 작성
- [ ] `CreateRoutineView` 단위 테스트 작성
- [ ] 접근성 테스트 포함

### 4단계: 스토리북 설정
- [ ] `CreateRoutineView` 스토리 작성
- [ ] `CreateRoutine` 스토리 작성

### 5단계: Controller Component 구현
- [ ] `CreateRoutine` 구현
- [ ] 부위 선택 로직 구현
- [ ] 라우팅 로직 구현

### 6단계: 통합 테스트
- [ ] `CreateRoutine` 컴포넌트 테스트 작성

### 7단계: 스타일링 및 UX 개선
- [ ] 반응형 그리드 레이아웃 구현
- [ ] 호버 및 포커스 상태 스타일링
- [ ] 선택 애니메이션 효과 추가
- [ ] 접근성 개선 (키보드 네비게이션, 스크린 리더 지원)

### 8단계: 라우팅 연결
- [ ] App.tsx에 루틴 생성 화면 라우트 추가
- [ ] 프리셋 선택 화면에서 새로운 루틴 만들기 버튼 클릭 시 이 화면으로 라우팅 연결

---

## 🔧 기술적 고려사항

### 의존성
- React Router for 라우팅
- CSS Grid 또는 Flexbox for 레이아웃

### 파일 구조
```
src/
  pages/
    create-routine/
      CreateRoutineView.tsx
      CreateRoutineView.test.tsx
      CreateRoutineView.stories.tsx
      CreateRoutine.tsx
      CreateRoutine.test.tsx
      CreateRoutine.stories.tsx
      index.ts
```

### Clean Architecture 적용
- **Presentation Layer**: `CreateRoutineView` - UI 표시만 담당
- **Application Layer**: `CreateRoutine` - 비즈니스 로직 및 라우팅 담당

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
- [ ] TypeScript 컴파일 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 스토리북에서 모든 상태 확인 가능
- [ ] 9개 운동 부위 버튼이 모두 표시
- [ ] 부위 선택 시 콘솔에 로그 출력
- [ ] 반응형 그리드 레이아웃 구현
- [ ] 접근성 기준 충족 (WCAG 2.1 AA)
- [ ] 키보드 네비게이션 완전 지원
- [ ] 부위 선택 애니메이션 구현
- [ ] 프리셋 선택 화면에서 새로운 루틴 만들기 버튼 클릭 시 이 화면으로 정상 이동 