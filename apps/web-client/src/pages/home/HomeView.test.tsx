import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeView } from './HomeView';

const mockOnStartWorkout = jest.fn();
const mockOnStartGoogleLogin = jest.fn();

beforeEach(() => {
  mockOnStartWorkout.mockClear();
  mockOnStartGoogleLogin.mockClear();
});

describe('HomeView (Landing)', () => {
  it('랜딩 핵심 요소(타이틀, 주요 CTA)가 렌더링된다', () => {
    render(
      <HomeView
        onStartWorkout={mockOnStartWorkout}
        onStartGoogleLogin={mockOnStartGoogleLogin}
      />
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Health Clock' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google로 로그인' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'GUEST로 시작하기' })).toBeInTheDocument();
  });

  it('GUEST CTA 클릭 시 onStartWorkout 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <HomeView
        onStartWorkout={mockOnStartWorkout}
        onStartGoogleLogin={mockOnStartGoogleLogin}
      />
    );

    const button = screen.getByRole('button', { name: 'GUEST로 시작하기' });
    await user.click(button);

    expect(mockOnStartWorkout).toHaveBeenCalledTimes(1);
  });

  it('Google 로그인 CTA 클릭 시 onStartGoogleLogin 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(
      <HomeView
        onStartWorkout={mockOnStartWorkout}
        onStartGoogleLogin={mockOnStartGoogleLogin}
      />
    );

    const button = screen.getByRole('button', { name: 'Google로 로그인' });
    await user.click(button);

    expect(mockOnStartGoogleLogin).toHaveBeenCalledTimes(1);
  });

  it('모바일 기준 CTA가 하단 고정 스타일을 가진다', () => {
    render(
      <HomeView
        onStartWorkout={mockOnStartWorkout}
        onStartGoogleLogin={mockOnStartGoogleLogin}
      />
    );

    const ctaStack = screen.getByTestId('home-cta-stack');
    expect(ctaStack.className).toContain('fixed');
    expect(ctaStack).toHaveStyle(
      'bottom: max(1.75rem, calc(env(safe-area-inset-bottom) + 0.75rem))'
    );
  });
});
