import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

it('Home 컴포넌트가 올바르게 렌더링된다', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  
  const button = screen.getByRole('button', { name: '운동 시작하기' });
  expect(button).toBeInTheDocument();
});

it('운동 시작 버튼 클릭 시 콘솔에 로그가 출력된다', async () => {
  const user = userEvent.setup();
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  
  const button = screen.getByRole('button', { name: '운동 시작하기' });
  await user.click(button);
  
  expect(consoleSpy).toHaveBeenCalledWith('프리셋 선택 화면으로 이동');
  
  consoleSpy.mockRestore();
}); 