import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { GoogleAuthCallback } from './GoogleAuthCallback';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const originalFetch = global.fetch;

const renderWithRoute = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/auth/google/loggedIn" element={<GoogleAuthCallback />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('GoogleAuthCallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn() as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('code/state가 있으면 exchange API를 호출하고 완료 시 프리셋 페이지로 이동한다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        accessToken: 'access-token',
        expiresIn: 3600,
        scope: 'openid email profile',
        tokenType: 'Bearer',
      }),
    });

    renderWithRoute('/auth/google/loggedIn?code=abc123&state=state123');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/google/exchange',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });

    const saved = localStorage.getItem('health-clock.google-auth');
    expect(saved).toContain('"accessToken":"access-token"');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/preset-selection', {
        replace: true,
      });
    });
  });

  it('query에 error가 있으면 실패 화면을 보여준다', async () => {
    renderWithRoute('/auth/google/loggedIn?error=access_denied');

    expect(
      await screen.findByRole('heading', { name: '로그인 실패' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Google 로그인 요청이 취소되었거나 거부되었습니다.')
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('code/state가 없으면 실패 화면을 보여준다', async () => {
    renderWithRoute('/auth/google/loggedIn');

    expect(
      await screen.findByRole('heading', { name: '로그인 실패' })
    ).toBeInTheDocument();
    expect(screen.getByText('로그인 정보가 올바르지 않습니다.')).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('exchange 실패 시 실패 화면을 보여준다', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'exchange failed' }),
    });

    renderWithRoute('/auth/google/loggedIn?code=abc123&state=state123');

    expect(
      await screen.findByRole('heading', { name: '로그인 실패' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('로그인 처리에 실패했습니다. 다시 시도해 주세요.')
    ).toBeInTheDocument();
  });
});
