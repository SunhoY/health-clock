import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeView } from './HomeView';

const mockOnStartWorkout = jest.fn();

beforeEach(() => {
  mockOnStartWorkout.mockClear();
});

describe('HomeView (Landing)', () => {
  it('랜딩 핵심 요소(타이틀, 설명, 주요 CTA)가 렌더링된다', () => {
    render(<HomeView onStartWorkout={mockOnStartWorkout} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Health Clock' })).toBeInTheDocument();
    expect(
      screen.getByText('건강한 라이프스타일을 위한 운동 루틴을 시작해보세요')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /운동 시작/i })).toBeInTheDocument();
  });

  it('주요 CTA 클릭 시 onStartWorkout 함수가 호출된다', async () => {
    const user = userEvent.setup();
    render(<HomeView onStartWorkout={mockOnStartWorkout} />);

    const button = screen.getByRole('button', { name: /운동 시작/i });
    await user.click(button);

    expect(mockOnStartWorkout).toHaveBeenCalledTimes(1);
  });

  it.todo('보조 CTA(예: 최근 루틴/기능 소개)가 제공된다');
  it.todo('모바일 뷰포트에서도 랜딩 핵심 요소의 정보 우선순위가 유지된다');
});
