import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Workout, setTempWorkoutData } from './Workout';
import { ExerciseDetail } from '../../types/exercise';

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {
  // Mock implementation
});

// Mock useNavigate
const mockNavigate = jest.fn();
let mockLocationState: unknown = undefined;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: mockLocationState,
    pathname: '/workout',
    search: '',
    hash: '',
  }),
}));

describe('Workout', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    mockNavigate.mockClear();
    mockLocationState = undefined;
    setTempWorkoutData([]);
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('운동 데이터가 없을 때 에러 메시지가 표시된다', () => {
    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    expect(screen.getByText('운동 데이터를 찾을 수 없습니다')).toBeInTheDocument();
    expect(screen.getByText('프리셋을 다시 선택해주세요.')).toBeInTheDocument();
  });

  it('운동 정보가 올바르게 표시된다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    expect(screen.getByText('운동 진행')).toBeInTheDocument();
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('chest')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
    expect(screen.getByText('20kg')).toBeInTheDocument();
  });

  it('라우터 state로 전달된 운동 데이터가 우선 적용된다', () => {
    mockLocationState = {
      exercises: [
        {
          exerciseId: 'row',
          exerciseName: '로우',
          bodyPart: '등',
          sets: 4,
          weight: 40,
        },
      ],
    };

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    expect(screen.getByText('로우')).toBeInTheDocument();
    expect(screen.getByText('등')).toBeInTheDocument();
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
    expect(screen.getByText('40kg')).toBeInTheDocument();
  });

  it('세트 완료 버튼 클릭 시 콘솔에 로그가 출력된다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    const completeButton = screen.getByText('세트 완료');
    await user.click(completeButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('세트 완료:', expect.objectContaining({
      exerciseId: 'bench-press',
      setNumber: 1,
      weight: 20
    }));
  });

  it('중단 버튼 클릭 시 프리셋 선택 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    const abandonButton = screen.getByText('중단');
    await user.click(abandonButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('운동 중단:', expect.objectContaining({
      completedSets: expect.any(Array),
      totalTime: expect.any(Number)
    }));
    expect(mockNavigate).toHaveBeenCalledWith('/preset-selection');
  });

  it('일시정지 버튼 클릭 시 콘솔에 로그가 출력된다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    const pauseButton = screen.getByText('일시정지');
    await user.click(pauseButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('운동 일시정지');
  });

  it('재개 버튼 클릭 시 콘솔에 로그가 출력된다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    // 먼저 일시정지
    const pauseButton = screen.getByText('일시정지');
    await user.click(pauseButton);
    
    // 재개 버튼 클릭
    const resumeButton = screen.getByText('재개');
    await user.click(resumeButton);
    
    expect(mockConsoleLog).toHaveBeenCalledWith('운동 재개');
  });

  it('휴식 건너뛰기 버튼 클릭 시 휴식이 종료된다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    // 세트 완료하여 휴식 상태로 전환
    const completeButton = screen.getByText('세트 완료');
    await user.click(completeButton);
    
    // 휴식 건너뛰기 버튼 클릭
    const skipButton = screen.getByText('휴식 건너뛰기');
    await user.click(skipButton);
    
    // 휴식 상태가 종료되어 세트 완료 버튼이 다시 표시됨
    expect(screen.getByText('세트 완료')).toBeInTheDocument();
  });

  it('유산소 운동일 때 시간이 표시된다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'running',
        exerciseName: '러닝',
        bodyPart: 'cardio',
        sets: 1,
        duration: 30
      }
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    expect(screen.getByText('러닝')).toBeInTheDocument();
    expect(screen.getByText('cardio')).toBeInTheDocument();
    expect(screen.getByText('30분')).toBeInTheDocument();
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
  });

  it('진행률이 올바르게 계산된다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );
    
    // 첫 번째 세트이므로 0%에 가까움
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
}); 
