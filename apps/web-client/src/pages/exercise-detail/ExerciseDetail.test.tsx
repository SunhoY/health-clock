import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ExerciseDetail } from './ExerciseDetail';
import { getTempRoutineData, setTempRoutineData } from '../routine-title/RoutineTitle';
import { getLocalPresets, resetLocalPresets } from '../preset-selection/presetStore';

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
    resetLocalPresets();
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

  it('완료 클릭 시 현재 화면 위에 제목 다이얼로그가 열린다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    await fillSetInput(user, 0, '20', '10');
    await user.click(screen.getByText('완료'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('루틴 제목')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('저장할 루틴의 제목을 입력해주세요')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalledWith('/routine-title');
  });

  it('다이얼로그 저장 시 루틴 저장 후 프리셋 선택으로 이동한다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    await fillSetInput(user, 0, '20', '10');
    await user.click(screen.getByText('완료'));
    await user.type(screen.getByLabelText('루틴 제목'), '오늘 루틴');
    await user.click(screen.getByText('저장'));

    expect(mockNavigate).toHaveBeenCalledWith('/preset-selection');
    expect(getLocalPresets()[0].title).toBe('오늘 루틴');

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
    await user.type(screen.getByLabelText('루틴 제목'), '완료 루틴');
    await user.click(screen.getByText('저장'));

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
    await user.type(screen.getByLabelText('루틴 제목'), '증감 테스트');
    await user.click(screen.getByText('저장'));

    const draft = getTempRoutineData();
    expect(draft).toHaveLength(1);
    expect(draft[0].setDetails).toEqual([
      { setNumber: 1, weight: 5, reps: 1 },
      { setNumber: 2, weight: 5, reps: 1 },
      { setNumber: 3, weight: 5, reps: 1 }
    ]);
  });

  it('빈 상태에서 감소 버튼을 눌러도 0 아래로 내려가지 않는다', async () => {
    const user = userEvent.setup();
    renderWithRoute('/exercise-detail/chest/bench-press');

    const minusWeight = screen.getByRole('button', { name: '1세트 중량 감소' });
    const minusReps = screen.getByRole('button', { name: '1세트 횟수 감소' });
    await user.click(minusWeight);
    await user.click(minusWeight);
    await user.click(minusReps);
    await user.click(minusReps);

    const weightInputs = screen.getAllByLabelText('중량(kg)') as HTMLInputElement[];
    const repsInputs = screen.getAllByLabelText('횟수') as HTMLInputElement[];
    expect(weightInputs[0].value).toBe('0');
    expect(repsInputs[0].value).toBe('0');

    await user.click(screen.getByRole('button', { name: '1세트 중량 증가' }));
    await user.click(screen.getByRole('button', { name: '1세트 횟수 증가' }));
    expect(weightInputs[0].value).toBe('5');
    expect(repsInputs[0].value).toBe('1');
  });

  it('입력이 비어 있으면 완료 버튼이 비활성화된다', () => {
    renderWithRoute('/exercise-detail/chest/bench-press');

    expect(screen.getByText('완료')).toBeDisabled();
  });
});
