import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeView } from './HomeView';

const mockOnStartWorkout = jest.fn();

beforeEach(() => {
  mockOnStartWorkout.mockClear();
});

it('홈 화면이 올바르게 렌더링된다', () => {
  render(<HomeView onStartWorkout={mockOnStartWorkout} />);
  
  const button = screen.getByRole('button', { name: '운동 시작하기' });
  expect(button).toBeInTheDocument();
});

it('버튼 클릭 시 onStartWorkout 함수가 호출된다', async () => {
  const user = userEvent.setup();
  render(<HomeView onStartWorkout={mockOnStartWorkout} />);
  
  const button = screen.getByRole('button', { name: '운동 시작하기' });
  await user.click(button);
  
  expect(mockOnStartWorkout).toHaveBeenCalledTimes(1);
}); 