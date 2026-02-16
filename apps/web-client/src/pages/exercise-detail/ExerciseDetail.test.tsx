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

const fillStrengthInputs = async (user: ReturnType<typeof userEvent.setup>) => {
  const weightInputs = screen.getAllByLabelText('중량(kg)');
  const repsInputs = screen.getAllByLabelText('횟수(reps)');

  for (let i = 0; i < 3; i += 1) {
    await user.clear(weightInputs[i]);
    await user.type(weightInputs[i], String(20 + i * 5));
    await user.clear(repsInputs[i]);
    await user.type(repsInputs[i], String(12 - i));
  }
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

  it('근력 운동에서 완료 클릭 시 세트별 정보가 저장되고 제목 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    await fillStrengthInputs(user);
    await user.click(screen.getByText('완료'));

    expect(mockNavigate).toHaveBeenCalledWith('/routine-title');

    const draft = getTempRoutineData();
    expect(draft).toHaveLength(1);
    expect(draft[0]).toEqual(
      expect.objectContaining({
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        sets: 3,
        setDetails: [
          { setNumber: 1, weight: 20, reps: 12 },
          { setNumber: 2, weight: 25, reps: 11 },
          { setNumber: 3, weight: 30, reps: 10 }
        ]
      })
    );
  });

  it('근력 운동에서 운동 더 추가 클릭 시 선택 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    await fillStrengthInputs(user);
    await user.click(screen.getByText('운동 더 추가'));

    expect(mockNavigate).toHaveBeenCalledWith('/exercise-selection/chest');
    expect(getTempRoutineData()).toHaveLength(1);
  });

  it('입력이 비어 있으면 완료 버튼이 비활성화된다', () => {
    renderWithRoute('/exercise-detail/chest/bench-press');

    expect(screen.getByText('완료')).toBeDisabled();
  });
});
