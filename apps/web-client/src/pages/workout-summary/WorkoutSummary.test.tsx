import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkoutSummary } from './WorkoutSummary';
import { WorkoutCompletionData } from '../../types/exercise';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => undefined);

const mockCompletionData: WorkoutCompletionData = {
  sessionId: 'session-1',
  completedAt: new Date(), // 오늘 날짜로 설정
  duration: 45,
  exercises: [
    {
      exerciseId: 'ex-1',
      exerciseName: '스쿼트',
      bodyPart: 'legs',
      sets: [
        { setNumber: 1, exerciseId: 'ex-1', weight: 50, reps: 10, completed: true },
        { setNumber: 2, exerciseId: 'ex-1', weight: 50, reps: 10, completed: true },
      ],
      totalWeight: 100,
    },
    {
      exerciseId: 'ex-2',
      exerciseName: '러닝',
      bodyPart: 'cardio',
      sets: [
        { setNumber: 1, exerciseId: 'ex-2', duration: 1800, completed: true }, // 30분
      ],
      totalDuration: 1800,
    },
  ],
  totalSets: 3,
  totalWeight: 100,
  caloriesBurned: 250,
};

describe('WorkoutSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('날짜별 운동 데이터 조회 시 콘솔에 로그를 출력한다', () => {
    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('날짜별 운동 데이터 조회:', expect.any(String));
  });

  it('운동 데이터 집계 계산 시 콘솔에 로그를 출력한다', () => {
    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('운동 데이터 집계 결과:', expect.any(Object));
  });

  it('URL state에서 completionData를 받아와서 임시 저장소에 추가한다', () => {
    const mockLocation = {
      state: { completionData: mockCompletionData },
      pathname: '/workout-summary',
      search: '',
      hash: '',
    };

    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
      useLocation: () => mockLocation,
    }));

    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('운동 완료 데이터가 요약 화면에 추가됨:', mockCompletionData);
  });

  it('뒤로가기 버튼 클릭 시 이전 페이지로 이동한다', () => {
    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '뒤로가기' }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('홈으로 버튼 클릭 시 홈 페이지로 이동한다', () => {
    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: '홈으로' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('로딩 상태가 올바르게 표시된다', () => {
    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    // 초기에는 로딩 상태가 표시되어야 함
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
    expect(screen.getByText('운동 데이터를 불러오고 있습니다.')).toBeInTheDocument();
  });

  it('운동 기록이 없을 때 빈 상태가 표시된다', async () => {
    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    // 로딩이 완료되면 빈 상태가 표시되어야 함
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByText('오늘은 운동 기록이 없어요')).toBeInTheDocument();
    expect(screen.getByText('운동을 시작하고 기록을 남겨보세요!')).toBeInTheDocument();
  });

  it('운동 데이터가 있을 때 요약 정보가 표시된다', async () => {
    // 임시 저장소에 데이터 추가
    const { setTempWorkoutSessions } = await import('./WorkoutSummary');
    setTempWorkoutSessions([mockCompletionData]);

    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    // 로딩이 완료되면 요약 정보가 표시되어야 함
    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(screen.getByText('1')).toBeInTheDocument(); // 운동 세션
    expect(screen.getByText('45분')).toBeInTheDocument(); // 총 운동 시간
    expect(screen.getByText('운동 종류')).toBeInTheDocument(); // 운동 종류 라벨
    expect(screen.getByText('총 세트')).toBeInTheDocument(); // 총 세트 라벨
  });

  it('웨이트 운동과 유산소 운동이 올바른 형식으로 표시된다', async () => {
    // 임시 저장소에 데이터 추가
    const { setTempWorkoutSessions } = await import('./WorkoutSummary');
    setTempWorkoutSessions([mockCompletionData]);

    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    // 로딩이 완료되면 운동 목록이 표시되어야 함
    await new Promise(resolve => setTimeout(resolve, 200));
    
    expect(screen.getByText('legs - 스쿼트 - 2세트')).toBeInTheDocument();
    expect(screen.getByText(/유산소 - 러닝/)).toBeInTheDocument();
  });

  it('특정 날짜의 데이터를 조회할 수 있다', async () => {
    const targetDate = new Date('2024-01-01T00:00:00Z');
    
    render(
      <MemoryRouter>
        <WorkoutSummary targetDate={targetDate} />
      </MemoryRouter>
    );

    expect(mockConsoleLog).toHaveBeenCalledWith('날짜별 운동 데이터 조회:', targetDate.toDateString());
  });
}); 