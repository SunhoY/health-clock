import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

it('Home 컴포넌트가 올바르게 렌더링된다', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  
  const button = screen.getByRole('button', { name: '운동 시작하기' });
  expect(button).toBeInTheDocument();
});

it('운동 시작 버튼 클릭 시 프리셋 선택 화면으로 라우팅된다', async () => {
  const user = userEvent.setup();
  
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  
  const button = screen.getByRole('button', { name: '운동 시작하기' });
  await user.click(button);
  
  expect(mockNavigate).toHaveBeenCalledWith('/preset-selection');
}); 