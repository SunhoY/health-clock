import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RoutineTitle, setTempRoutineData } from './RoutineTitle';
import { ExerciseDetail } from '../../types/exercise';

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {
  // Mock implementation
});

// Mock useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

  it('기본 제목이 생성되어 표시된다', () => {
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
    
    expect(screen.getByText('루틴 제목 입력')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/chest 루틴/)).toBeInTheDocument();
  });

  it('복합 루틴의 경우 기본 제목이 올바르게 생성된다', () => {
    const mockExercises: ExerciseDetail[] = [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      },
      {
        exerciseId: 'squat',
        exerciseName: '스쿼트',
        bodyPart: 'legs',
        sets: 3,
        weight: 30
      }
    ];
    setTempRoutineData(mockExercises);

    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );
    
    expect(screen.getByDisplayValue(/복합 루틴/)).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 프리셋 선택 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );
    
    const cancelButton = screen.getByText('취소');
    await user.click(cancelButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/preset-selection');
  });

  it('빈 제목으로 저장을 시도하면 에러가 표시된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );
    
    const input = screen.getByLabelText('루틴 제목');
    await user.clear(input);
    
    expect(screen.getByText('제목을 입력해주세요')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeDisabled();
  });

  it('금지어가 포함된 제목은 에러가 표시된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );
    
    const input = screen.getByLabelText('루틴 제목');
    await user.clear(input);
    await user.type(input, 'test 루틴');
    
    expect(screen.getByText('사용할 수 없는 단어가 포함되어 있습니다')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeDisabled();
  });

  it('특수문자가 포함된 제목은 에러가 표시된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );
    
    const input = screen.getByLabelText('루틴 제목');
    await user.clear(input);
    await user.type(input, '테스트@루틴');
    
    expect(screen.getByText('제목에는 한글, 영문, 숫자, 공백, 하이픈, 언더스코어만 사용할 수 있습니다')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeDisabled();
  });

  it('유효한 제목으로 변경하면 저장 버튼이 활성화된다', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoutineTitle />
      </MemoryRouter>
    );
    
    const input = screen.getByLabelText('루틴 제목');
    await user.clear(input);
    await user.type(input, '나만의 루틴');
    
    expect(screen.getByText('저장')).not.toBeDisabled();
  });
}); 