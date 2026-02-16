import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RoutineTitle, setTempRoutineData } from './RoutineTitle';
import { ExerciseDetail } from '../../types/exercise';

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {
  // noop
});

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('RoutineTitle', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    mockNavigate.mockClear();
    setTempRoutineData([]);
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('입력값은 비어 있고 placeholder 문구가 표시된다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ];
    setTempRoutineData(mockExercises);

    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );

    const input = screen.getByLabelText('루틴 제목') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(input.placeholder).toBe('저장할 루틴의 제목을 입력해주세요');
  });

  it('취소 버튼 클릭 시 이전 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );

    await user.click(screen.getByText('취소'));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('빈 제목이면 저장 버튼이 비활성화된다', () => {
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );

    expect(screen.getByText('저장')).toBeDisabled();
  });

  it('공백만 입력하면 에러가 표시된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );

    const input = screen.getByLabelText('루틴 제목');
    await user.type(input, '   ');

    expect(screen.getByText('제목을 입력해주세요')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeDisabled();
  });

  it('빈 값이 아니면 어떤 문자열도 허용한다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );

    const input = screen.getByLabelText('루틴 제목');
    await user.type(input, 'test@루틴#1');

    expect(screen.getByText('저장')).not.toBeDisabled();
  });
});
