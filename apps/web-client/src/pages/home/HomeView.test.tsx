import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeView } from './HomeView';

const mockOnStartWorkout = jest.fn();

beforeEach(() => {
  mockOnStartWorkout.mockClear();
});

describe('HomeView (Landing)', () => {
  it('랜딩 핵심 요소(타이틀, 주요 CTA)가 렌더링된다', () => {
    render(<HomeView onStartWorkout={mockOnStartWorkout} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Health Clock' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /운동 시작/i })).toBeInTheDocument();
  });

  it('주요 CTA 클릭 시 onStartWorkout 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(<HomeView onStartWorkout={mockOnStartWorkout} />);

    const button = screen.getByRole('button', { name: /운동 시작/i });
    await user.click(button);

    expect(mockOnStartWorkout).toHaveBeenCalledTimes(1);
  });

  it('모바일 기준 CTA가 하단 고정 스타일을 가진다', () => {
    render(<HomeView onStartWorkout={mockOnStartWorkout} />);

    const button = screen.getByRole('button', { name: /운동 시작/i });
    expect(button.className).toContain('fixed');
    expect(button).toHaveStyle(
      'bottom: max(1.75rem, calc(env(safe-area-inset-bottom) + 0.75rem))'
    );
  });
});
