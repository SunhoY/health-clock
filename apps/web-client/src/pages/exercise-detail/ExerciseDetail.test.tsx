import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ExerciseDetail } from './ExerciseDetail';

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {
  // Mock implementation
});

describe('ExerciseDetail', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('벤치프레스 운동 상세 화면이 렌더링된다', () => {
    render(
      <MemoryRouter initialEntries={['/exercise-detail/chest/bench-press']}>
        <Routes>
          <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('벤치프레스 상세 설정')).toBeInTheDocument();
    expect(screen.getByText('세트 수')).toBeInTheDocument();
    expect(screen.getByText('중량')).toBeInTheDocument();
  });

  it('러닝머신 운동 상세 화면이 렌더링된다', () => {
    render(
      <MemoryRouter initialEntries={['/exercise-detail/cardio/treadmill']}>
        <Routes>
          <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('러닝머신 상세 설정')).toBeInTheDocument();
    expect(screen.getByText('세트 수')).toBeInTheDocument();
    expect(screen.getByText('시간')).toBeInTheDocument();
    expect(screen.queryByText('중량')).not.toBeInTheDocument();
  });

  it('존재하지 않는 운동에 대해 에러 메시지를 표시한다', () => {
    render(
      <MemoryRouter initialEntries={['/exercise-detail/chest/non-existent']}>
        <Routes>
          <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('운동을 찾을 수 없습니다')).toBeInTheDocument();
    expect(screen.getByText('선택한 운동이 존재하지 않습니다.')).toBeInTheDocument();
  });

  it('운동 추가 버튼 클릭 시 콘솔에 로그가 출력된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/exercise-detail/chest/bench-press']}>
        <Routes>
          <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </MemoryRouter>
    );
    
    const addButton = screen.getByText('운동 추가');
    await user.click(addButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('운동 추가:', expect.objectContaining({
      exerciseId: 'bench-press',
      exerciseName: '벤치프레스',
      bodyPart: 'chest',
      sets: 3,
      weight: 20
    }));
  });

  it('루틴 완료 버튼 클릭 시 콘솔에 로그가 출력된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/exercise-detail/chest/bench-press']}>
        <Routes>
          <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </MemoryRouter>
    );
    
    const completeButton = screen.getByText('루틴 완료');
    await user.click(completeButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('루틴 완료:', expect.objectContaining({
      exerciseId: 'bench-press',
      exerciseName: '벤치프레스',
      bodyPart: 'chest',
      sets: 3,
      weight: 20
    }));
  });

  it('유산소 운동의 경우 중량 대신 시간 정보가 포함된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/exercise-detail/cardio/treadmill']}>
        <Routes>
          <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </MemoryRouter>
    );
    
    const addButton = screen.getByText('운동 추가');
    await user.click(addButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('운동 추가:', expect.objectContaining({
      exerciseId: 'treadmill',
      exerciseName: '러닝머신',
      bodyPart: 'cardio',
      sets: 3,
      duration: 30,
      weight: undefined
    }));
  });

  it('운동 정보가 올바르게 표시된다', () => {
    render(
      <MemoryRouter initialEntries={['/exercise-detail/chest/bench-press']}>
        <Routes>
          <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('chest')).toBeInTheDocument();
    expect(screen.getByText('바벨, 벤치')).toBeInTheDocument();
  });
}); 