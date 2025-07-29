import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateRoutineView } from './CreateRoutineView';

const mockBodyParts = [
  {
    id: 'chest',
    name: '가슴',
    exercises: ['벤치프레스', '인클라인 벤치프레스', '덤벨 플라이', '푸쉬업']
  },
  {
    id: 'back',
    name: '등',
    exercises: ['바벨 로우', '렛풀다운', '데드리프트']
  }
];

const mockOnBodyPartSelect = jest.fn();

beforeEach(() => {
  mockOnBodyPartSelect.mockClear();
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
    expect(screen.getByText('4개의 운동')).toBeInTheDocument();
    expect(screen.getByText('3개의 운동')).toBeInTheDocument();
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

  it('부위 버튼에 접근성 속성이 올바르게 설정된다', () => {
    render(
      <CreateRoutineView
        bodyParts={mockBodyParts}
        onBodyPartSelect={mockOnBodyPartSelect}
      />
    );
    
    const chestButton = screen.getByRole('button', { name: '가슴 부위 선택하기' });
    expect(chestButton).toHaveAttribute('tabIndex', '0');
  });

  it('운동 목록이 올바르게 표시된다', () => {
    render(
      <CreateRoutineView
        bodyParts={mockBodyParts}
        onBodyPartSelect={mockOnBodyPartSelect}
      />
    );
    
    expect(screen.getByText('• 벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('• 인클라인 벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('+2개 더...')).toBeInTheDocument();
  });
}); 