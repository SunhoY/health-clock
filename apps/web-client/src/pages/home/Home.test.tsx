import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Home } from './Home';

const mockNavigate = jest.fn();
const mockFetch = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  mockNavigate.mockClear();
  mockFetch.mockReset();
  localStorage.clear();
  Object.defineProperty(global, 'fetch', {
    value: mockFetch,
    writable: true
  });
});

it('Home 컴포넌트가 올바르게 렌더링된다', () => {
  mockFetch.mockResolvedValue({
    ok: false,
    status: 401
  });

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(screen.getByRole('button', { name: 'Google로 로그인' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'GUEST로 시작하기' })).toBeInTheDocument();
});

it('운동 시작 버튼 클릭 시 프리셋 선택 화면으로 라우팅된다', async () => {
  const user = userEvent.setup();
  mockFetch.mockResolvedValue({
    ok: false,
    status: 401
  });

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  const button = screen.getByRole('button', { name: 'GUEST로 시작하기' });
  await user.click(button);

  expect(localStorage.getItem('health-clock.session-mode')).toBe('guest');
  expect(mockNavigate).toHaveBeenCalledWith('/preset-selection');
});

it('세션이 유효하면 홈 진입 시 프리셋 선택 화면으로 자동 이동한다', async () => {
  localStorage.setItem(
    'health-clock.google-auth',
    JSON.stringify({
      accessToken: 'token-1',
      tokenType: 'Bearer'
    })
  );
  mockFetch.mockResolvedValue({
    ok: true,
    status: 200
  });

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith('/api/routines', {
      headers: {
        Authorization: 'Bearer token-1'
      }
    });
  });
  expect(mockNavigate).toHaveBeenCalledWith('/preset-selection', { replace: true });
});

it('세션 검증이 401이면 세션을 제거하고 홈에 남는다', async () => {
  localStorage.setItem(
    'health-clock.google-auth',
    JSON.stringify({
      accessToken: 'expired-token',
      tokenType: 'Bearer'
    })
  );
  mockFetch.mockResolvedValue({
    ok: false,
    status: 401
  });

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Google로 로그인' })).toBeInTheDocument();
  });
  expect(localStorage.getItem('health-clock.google-auth')).toBeNull();
  expect(mockNavigate).not.toHaveBeenCalledWith('/preset-selection', { replace: true });
});

it('게스트 모드에서는 토큰이 있어도 자동 세션 검증을 수행하지 않는다', async () => {
  localStorage.setItem(
    'health-clock.google-auth',
    JSON.stringify({
      accessToken: 'token-1',
      tokenType: 'Bearer'
    })
  );
  localStorage.setItem('health-clock.session-mode', 'guest');

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(await screen.findByRole('button', { name: 'GUEST로 시작하기' })).toBeInTheDocument();
  expect(mockFetch).not.toHaveBeenCalled();
  expect(mockNavigate).not.toHaveBeenCalledWith('/preset-selection', { replace: true });
});
