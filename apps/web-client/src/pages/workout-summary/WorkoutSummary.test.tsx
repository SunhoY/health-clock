import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WorkoutSummary, setTempWorkoutSessions } from './WorkoutSummary';
import { WorkoutCompletionData } from '../../types/exercise';

const mockNavigate = jest.fn();
let mockLocationState: unknown = undefined;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: mockLocationState,
    pathname: '/workout-summary',
    search: '',
    hash: '',
  }),
}));

const mockCompletionData: WorkoutCompletionData = {
  sessionId: 'session-1',
  completedAt: new Date(),
  duration: 45,
  exercises: [
    {
      exerciseId: 'ex-cardio',
      exerciseName: '러닝',
      bodyPart: 'cardio',
      sets: [{ setNumber: 1, exerciseId: 'ex-cardio', duration: 30, completed: true }],
    },
    {
      exerciseId: 'ex-upper',
      exerciseName: '벤치프레스',
      bodyPart: 'chest',
      sets: [
        { setNumber: 1, exerciseId: 'ex-upper', weight: 50, reps: 10, completed: true },
        { setNumber: 2, exerciseId: 'ex-upper', weight: 60, reps: 8, completed: true },
      ],
    },
    {
      exerciseId: 'ex-core',
      exerciseName: '크런치',
      bodyPart: 'abs',
      sets: [{ setNumber: 1, exerciseId: 'ex-core', weight: 20, reps: 15, completed: true }],
    },
  ],
  totalSets: 4,
  totalWeight: 130,
  caloriesBurned: 250,
};

describe('WorkoutSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationState = undefined;
    setTempWorkoutSessions([]);
  });

  it('location state 기반 데이터로 부위별 상세 요약이 표시된다', async () => {
    mockLocationState = { completionData: mockCompletionData };

    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(screen.getByTestId('today-body-parts')).toHaveTextContent('유산소');
    expect(screen.getByTestId('today-body-parts')).toHaveTextContent('상체');
    expect(screen.getByTestId('today-body-parts')).toHaveTextContent('코어');

    expect(screen.getByTestId('section-cardio')).toHaveTextContent('kcal');
    expect(screen.getByTestId('section-upper')).toHaveTextContent('2세트');
    expect(screen.getByTestId('section-upper')).toHaveTextContent('60kg');
    expect(screen.getByTestId('section-core')).toHaveTextContent('1세트');
    expect(screen.getByTestId('section-core')).toHaveTextContent('20kg');
  });

  it('오늘 상체만 수행하면 상체 섹션만 표시된다', async () => {
    const upperOnlyData: WorkoutCompletionData = {
      ...mockCompletionData,
      exercises: [
        {
          exerciseId: 'ex-upper',
          exerciseName: '벤치프레스',
          bodyPart: 'chest',
          sets: [{ setNumber: 1, exerciseId: 'ex-upper', weight: 70, reps: 6, completed: true }],
        },
      ],
    };

    setTempWorkoutSessions([upperOnlyData]);

    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(screen.getByTestId('today-body-parts')).toHaveTextContent('상체');
    expect(screen.queryByTestId('section-cardio')).not.toBeInTheDocument();
    expect(screen.queryByTestId('section-lower')).not.toBeInTheDocument();
    expect(screen.queryByTestId('section-core')).not.toBeInTheDocument();
    expect(screen.getByTestId('section-upper')).toHaveTextContent('1세트');
    expect(screen.getByTestId('section-upper')).toHaveTextContent('70kg');
  });

  it('뒤로가기 버튼 클릭 시 이전 페이지로 이동한다', async () => {
    setTempWorkoutSessions([mockCompletionData]);

    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    fireEvent.click(screen.getByRole('button', { name: '뒤로가기' }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('홈으로 버튼 클릭 시 홈 페이지로 이동한다', async () => {
    setTempWorkoutSessions([mockCompletionData]);

    render(
      <MemoryRouter>
        <WorkoutSummary />
      </MemoryRouter>
    );

    await new Promise(resolve => setTimeout(resolve, 50));

    fireEvent.click(screen.getByRole('button', { name: '홈으로' }));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
