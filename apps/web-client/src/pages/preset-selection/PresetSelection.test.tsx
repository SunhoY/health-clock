import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PresetSelection } from './PresetSelection';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('PresetSelection', () => {
  it('PresetSelection 컴포넌트가 올바르게 렌더링된다', () => {
    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    expect(screen.getByText('운동 루틴 선택')).toBeInTheDocument();
    expect(screen.getByText('전신 운동')).toBeInTheDocument();
    expect(screen.getByText('상체 집중')).toBeInTheDocument();
  });

  it('프리셋 선택 시 콘솔에 로그가 출력된다', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    const presetCard = screen.getByText('전신 운동');
    await user.click(presetCard);

    expect(consoleSpy).toHaveBeenCalledWith('선택된 프리셋:', '1');

    consoleSpy.mockRestore();
  });

  it('새로운 루틴 만들기 버튼 클릭 시 콘솔에 로그가 출력된다', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '새로운 루틴 만들기' });
    await user.click(addButton);

    expect(consoleSpy).toHaveBeenCalledWith('새로운 루틴 만들기');

    consoleSpy.mockRestore();
  });
}); 