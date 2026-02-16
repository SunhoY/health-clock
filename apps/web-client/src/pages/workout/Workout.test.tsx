import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Workout, setTempWorkoutData } from './Workout';
import { ExerciseDetail } from '../../types/exercise';

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {
  // Mock implementation
});

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

  afterEach(() => {
    jest.useRealTimers();
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

  it('운동 핵심 정보와 지표가 올바르게 표시된다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20,
        reps: 10,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    expect(screen.getByText('운동 1 / 1')).toBeInTheDocument();
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('1 / 3 세트')).toBeInTheDocument();
    expect(screen.getByText('20kg')).toBeInTheDocument();
    expect(screen.getByText('10회')).toBeInTheDocument();
    expect(screen.getByText('세트 완료')).toBeInTheDocument();
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
    expect(screen.getByText('1 / 4 세트')).toBeInTheDocument();
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
        weight: 20,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    await user.click(screen.getByText('세트 완료'));

    expect(mockConsoleLog).toHaveBeenCalledWith(
      '세트 완료:',
      expect.objectContaining({
        exerciseId: 'bench-press',
        setNumber: 1,
        weight: 20,
      })
    );
  });

  it('세트 완료 후 휴식 화면에 이전/다음 세트 정보가 위계에 맞게 표시된다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20,
        reps: 10,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    await user.click(screen.getByText('세트 완료'));

    expect(screen.getByText('이전 1 / 3 세트')).toBeInTheDocument();
    expect(screen.getByText('다음 2 / 3 세트')).toBeInTheDocument();
    expect(screen.getAllByText('20kg')).toHaveLength(2);
    expect(screen.getAllByText('10회')).toHaveLength(2);
    expect(screen.getByText('바로 다음 세트')).toBeInTheDocument();
    expect(screen.getByText('이전 1 / 3 세트')).toHaveClass('text-slate-500');
    expect(screen.getByText('다음 2 / 3 세트')).toHaveClass('text-emerald-300');
  });

  it('운동 마지막 세트 완료 후 다음 운동 전환 화면이 표시된다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'push-up',
        exerciseName: '푸시업',
        bodyPart: 'chest',
        sets: 1,
        reps: 15,
      },
      {
        exerciseId: 'squat',
        exerciseName: '스쿼트',
        bodyPart: 'legs',
        sets: 2,
        weight: 40,
        reps: 12,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    await user.click(screen.getByText('세트 완료'));

    expect(screen.getByText('운동완료')).toBeInTheDocument();
    expect(screen.getByText('푸시업 완료')).toBeInTheDocument();
    expect(screen.getByText('다음 운동')).toBeInTheDocument();
    expect(screen.getByText('스쿼트')).toBeInTheDocument();
    expect(screen.getByText('40kg')).toBeInTheDocument();
    expect(screen.getByText('12회')).toBeInTheDocument();
    expect(screen.getByText('휴식 스톱워치')).toBeInTheDocument();
    expect(screen.getByText('00:00')).toBeInTheDocument();
    expect(screen.getByText('다음 운동 시작')).toBeInTheDocument();
  });

  it('운동 간 전환 화면에서 스톱워치가 증가한다', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'push-up',
        exerciseName: '푸시업',
        bodyPart: 'chest',
        sets: 1,
      },
      {
        exerciseId: 'squat',
        exerciseName: '스쿼트',
        bodyPart: 'legs',
        sets: 1,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    await user.click(screen.getByText('세트 완료'));
    expect(screen.getByText('00:00')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('00:02')).toBeInTheDocument();
  });

  it('다음 운동 시작 버튼 클릭 시 다음 운동 1세트로 이동한다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'push-up',
        exerciseName: '푸시업',
        bodyPart: 'chest',
        sets: 1,
      },
      {
        exerciseId: 'squat',
        exerciseName: '스쿼트',
        bodyPart: 'legs',
        sets: 2,
        weight: 40,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    await user.click(screen.getByText('세트 완료'));
    await user.click(screen.getByText('다음 운동 시작'));

    expect(screen.getByText('스쿼트')).toBeInTheDocument();
    expect(screen.getByText('1 / 2 세트')).toBeInTheDocument();
    expect(screen.queryByText('운동완료')).not.toBeInTheDocument();
    expect(screen.queryByText('다음 운동 시작')).not.toBeInTheDocument();
  });

  it('휴식 건너뛰기 동작 후 다시 세트 완료 버튼이 표시된다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    await user.click(screen.getByText('세트 완료'));
    expect(screen.getByText('바로 다음 세트')).toBeInTheDocument();

    await user.click(screen.getByText('바로 다음 세트'));

    expect(screen.getByText('세트 완료')).toBeInTheDocument();
  });

  it('지표가 undefined이면 출력되지 않는다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'running',
        exerciseName: '러닝',
        bodyPart: 'cardio',
        sets: 1,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    expect(screen.getByText('러닝')).toBeInTheDocument();
    expect(screen.getByText('1 / 1 세트')).toBeInTheDocument();
    expect(screen.queryByText('kg')).not.toBeInTheDocument();
    expect(screen.queryByText('회')).not.toBeInTheDocument();
    expect(screen.queryByText('분')).not.toBeInTheDocument();
  });

  it('유산소 운동일 때 시간 지표가 표시된다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'running',
        exerciseName: '러닝',
        bodyPart: 'cardio',
        sets: 1,
        duration: 30,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    expect(screen.getByText('러닝')).toBeInTheDocument();
    expect(screen.getByText('30분')).toBeInTheDocument();
  });

  it('진행률이 올바르게 계산된다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    expect(screen.getByText('0% 완료')).toBeInTheDocument();
  });

  it('마지막 운동까지 완료하면 완료 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'push-up',
        exerciseName: '푸시업',
        bodyPart: 'chest',
        sets: 1,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    await user.click(screen.getByText('세트 완료'));

    expect(mockNavigate).toHaveBeenCalledWith('/workout-complete', {
      state: { completionData: expect.any(Object) },
    });
    expect(screen.queryByText('다음 운동 시작')).not.toBeInTheDocument();
  });

  it('일시정지와 중단 버튼은 제공되지 않는다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20,
      },
    ];
    setTempWorkoutData(mockExercises);

    render(
      <MemoryRouter>
        <Workout />
      </MemoryRouter>
    );

    expect(screen.queryByText('일시정지')).not.toBeInTheDocument();
    expect(screen.queryByText('재개')).not.toBeInTheDocument();
    expect(screen.queryByText('중단')).not.toBeInTheDocument();
  });
});
