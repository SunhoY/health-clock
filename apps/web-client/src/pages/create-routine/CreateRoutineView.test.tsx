import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateRoutineView } from './CreateRoutineView';

const mockBodyParts = [
  {
    id: 'chest',
    name: '가슴'
  },
  {
    id: 'back',
    name: '등'
  }
];

const mockOnBodyPartSelect = jest.fn();
const mockOnRetry = jest.fn();

beforeEach(() => {
  mockOnBodyPartSelect.mockClear();
  mockOnRetry.mockClear();
});

describe('CreateRoutineView', () => {
  it('페이지 제목과 서브타이틀이 올바르게 표시된다', () => {
    render(
      <CreateRoutineView
        bodyParts={mockBodyParts}
        onBodyPartSelect={mockOnBodyPartSelect}
      />
    );

    expect(screen.getByText('운동 루틴 만들기')).toBeInTheDocument();
    expect(screen.getByText('운동할 부위를 선택해주세요')).toBeInTheDocument();
  });

  it('모든 운동 부위 버튼이 렌더링된다', () => {
    render(
      <CreateRoutineView
        bodyParts={mockBodyParts}
        onBodyPartSelect={mockOnBodyPartSelect}
      />
    );

    expect(screen.getByText('가슴')).toBeInTheDocument();
    expect(screen.getByText('등')).toBeInTheDocument();
  });

  it('부위 버튼 클릭 시 콜백 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <CreateRoutineView
        bodyParts={mockBodyParts}
        onBodyPartSelect={mockOnBodyPartSelect}
      />
    );

    const chestButton = screen.getByText('가슴');
    await user.click(chestButton);

    expect(mockOnBodyPartSelect).toHaveBeenCalledWith('chest');
  });

  it('로딩 상태를 표시한다', () => {
    render(
      <CreateRoutineView
        bodyParts={[]}
        onBodyPartSelect={mockOnBodyPartSelect}
        isLoading
      />
    );

    expect(screen.getByText('운동 부위를 불러오는 중입니다.')).toBeInTheDocument();
  });

  it('에러 상태에서 재시도 버튼을 누르면 콜백이 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <CreateRoutineView
        bodyParts={[]}
        onBodyPartSelect={mockOnBodyPartSelect}
        loadError="운동 부위 목록을 불러오지 못했습니다."
        onRetry={mockOnRetry}
      />
    );

    expect(
      screen.getByText('운동 부위 목록을 불러오지 못했습니다.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});
