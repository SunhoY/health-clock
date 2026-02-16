import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ExerciseDetail } from './ExerciseDetail';
import { getTempRoutineData, setTempRoutineData } from '../routine-title/RoutineTitle';

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {
  // noop
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRoute = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
      </Routes>
    </MemoryRouter>
  );
};

const fillSetInput = async (
  user: ReturnType<typeof userEvent.setup>,
  setIndex: number,
  weight: string,
  reps: string
) => {
  const weightInputs = screen.getAllByLabelText('중량(kg)');
  const repsInputs = screen.getAllByLabelText('횟수');

  await user.clear(weightInputs[setIndex]);
  await user.type(weightInputs[setIndex], weight);
  await user.clear(repsInputs[setIndex]);
  await user.type(repsInputs[setIndex], reps);
};

describe('ExerciseDetail', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    mockNavigate.mockClear();
    setTempRoutineData([]);
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('근력 운동 상세 입력 화면이 렌더링된다', () => {
    renderWithRoute('/exercise-detail/chest/bench-press');

    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByTestId('strength-set-row-1')).toBeInTheDocument();
    expect(screen.getByText('운동 더 추가')).toBeInTheDocument();
    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('횟수 라벨은 reps 표기 없이 출력된다', () => {
    renderWithRoute('/exercise-detail/chest/bench-press');

    expect(screen.getAllByText('횟수')).toHaveLength(3);
    expect(screen.queryByText('횟수(reps)')).not.toBeInTheDocument();
  });

  it('유산소 운동 상세 입력 화면이 렌더링된다', () => {
    renderWithRoute('/exercise-detail/cardio/treadmill');

    expect(screen.getByText('러닝머신')).toBeInTheDocument();
    expect(screen.getByLabelText('시간(분)')).toBeInTheDocument();
    expect(screen.queryByLabelText('중량(kg)')).not.toBeInTheDocument();
  });

  it('존재하지 않는 운동이면 에러 메시지를 표시한다', () => {
    renderWithRoute('/exercise-detail/chest/not-found');

    expect(screen.getByText('운동을 찾을 수 없습니다')).toBeInTheDocument();
  });

  it('1세트 입력 시 미입력 세트는 자동 채움되어 저장된다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    await fillSetInput(user, 0, '20', '10');
    await user.click(screen.getByText('완료'));

    expect(mockNavigate).toHaveBeenCalledWith('/routine-title');

    const draft = getTempRoutineData();
    expect(draft).toHaveLength(1);
    expect(draft[0].setDetails).toEqual([
      { setNumber: 1, weight: 20, reps: 10 },
      { setNumber: 2, weight: 20, reps: 10 },
      { setNumber: 3, weight: 20, reps: 10 }
    ]);
  });

  it('이미 입력된 세트 값은 자동 채움으로 덮어쓰지 않는다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    await fillSetInput(user, 1, '30', '8');
    await fillSetInput(user, 0, '20', '10');
    await user.click(screen.getByText('완료'));

    const draft = getTempRoutineData();
    expect(draft).toHaveLength(1);
    expect(draft[0].setDetails).toEqual([
      { setNumber: 1, weight: 20, reps: 10 },
      { setNumber: 2, weight: 30, reps: 8 },
      { setNumber: 3, weight: 20, reps: 10 }
    ]);
  });

  it('근력 운동에서 운동 더 추가 클릭 시 선택 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    await fillSetInput(user, 0, '20', '10');
    await user.click(screen.getByText('운동 더 추가'));

    expect(mockNavigate).toHaveBeenCalledWith('/exercise-selection/chest');
    expect(getTempRoutineData()).toHaveLength(1);
  });

  it('중량/횟수 증감 버튼이 동작한다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    await user.click(screen.getByRole('button', { name: '1세트 중량 증가' }));
    await user.click(screen.getByRole('button', { name: '1세트 횟수 증가' }));
    await user.click(screen.getByText('완료'));

    const draft = getTempRoutineData();
    expect(draft).toHaveLength(1);
    expect(draft[0].setDetails).toEqual([
      { setNumber: 1, weight: 5, reps: 1 },
      { setNumber: 2, weight: 5, reps: 1 },
      { setNumber: 3, weight: 5, reps: 1 }
    ]);
  });

  it('입력이 비어 있으면 완료 버튼이 비활성화된다', () => {
    renderWithRoute('/exercise-detail/chest/bench-press');

    expect(screen.getByText('완료')).toBeDisabled();
  });
});
