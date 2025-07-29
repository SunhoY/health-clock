import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { CreateRoutine } from './CreateRoutine';

const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('CreateRoutine', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('CreateRoutine 컴포넌트가 올바르게 렌더링된다', () => {
    render(
      <MemoryRouter>
        <CreateRoutine />
      </MemoryRouter>
    );
    
    expect(screen.getByText('운동 루틴 만들기')).toBeInTheDocument();
    expect(screen.getByText('운동할 부위를 선택해주세요')).toBeInTheDocument();
    expect(screen.getByText('가슴')).toBeInTheDocument();
    expect(screen.getByText('등')).toBeInTheDocument();
    expect(screen.getByText('하체')).toBeInTheDocument();
    expect(screen.getByText('어깨')).toBeInTheDocument();
    expect(screen.getByText('팔')).toBeInTheDocument();
    expect(screen.getByText('복부')).toBeInTheDocument();
    expect(screen.getByText('종아리')).toBeInTheDocument();
    expect(screen.getByText('전신')).toBeInTheDocument();
    expect(screen.getByText('유산소')).toBeInTheDocument();
  });

  it('부위 선택 시 운동 선택 화면으로 라우팅된다', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <MemoryRouter>
        <CreateRoutine />
      </MemoryRouter>
    );
    
    const chestButton = screen.getByText('가슴');
    await user.click(chestButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('선택된 부위:', 'chest');
    expect(mockNavigate).toHaveBeenCalledWith('/exercise-selection/chest');
    consoleSpy.mockRestore();
  });

  it('모든 부위 버튼이 클릭 가능하다', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <MemoryRouter>
        <CreateRoutine />
      </MemoryRouter>
    );
    
    const bodyParts = ['가슴', '등', '하체', '어깨', '팔', '복부', '종아리', '전신', '유산소'];
    
    for (const bodyPart of bodyParts) {
      const button = screen.getByText(bodyPart);
      await user.click(button);
    }
    
    expect(consoleSpy).toHaveBeenCalledTimes(9);
    consoleSpy.mockRestore();
  });
}); 