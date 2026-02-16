import { render, screen, fireEvent } from '@testing-library/react';
import { WorkoutSummaryView } from './WorkoutSummaryView';
import { WorkoutDetailSummaryViewModel } from '../../types/exercise';

const mockViewModel: WorkoutDetailSummaryViewModel = {
  todayBodyParts: ['cardio', 'upper', 'core'],
  sections: [
    {
      bodyPart: 'cardio',
      label: '유산소',
      caloriesBurned: 320,
    },
    {
      bodyPart: 'upper',
      label: '상체',
      totalSets: 8,
      maxWeight: 60,
    },
    {
      bodyPart: 'core',
      label: '코어',
      totalSets: 4,
      maxWeight: 20,
    },
  ],
};

const mockHandlers = {
  onGoHome: jest.fn(),
};

describe('WorkoutSummaryView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('오늘 수행한 운동 부위가 표시된다', () => {
    render(
      <WorkoutSummaryView
        viewModel={mockViewModel}
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('today-body-parts')).toHaveTextContent('유산소');
    expect(screen.getByTestId('today-body-parts')).toHaveTextContent('상체');
    expect(screen.getByTestId('today-body-parts')).toHaveTextContent('코어');
  });

  it('유산소 섹션에는 소모 칼로리가 표시된다', () => {
    render(
      <WorkoutSummaryView
        viewModel={mockViewModel}
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('section-cardio')).toHaveTextContent('320kcal');
  });

  it('근력 섹션에는 총 세트수와 최대 중량이 표시된다', () => {
    render(
      <WorkoutSummaryView
        viewModel={mockViewModel}
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('section-upper')).toHaveTextContent('8세트');
    expect(screen.getByTestId('section-upper')).toHaveTextContent('60kg');
    expect(screen.getByTestId('section-core')).toHaveTextContent('4세트');
    expect(screen.getByTestId('section-core')).toHaveTextContent('20kg');
  });

  it('수행하지 않은 부위는 표시되지 않는다', () => {
    render(
      <WorkoutSummaryView
        viewModel={mockViewModel}
        {...mockHandlers}
      />
    );

    expect(screen.queryByTestId('section-lower')).not.toBeInTheDocument();
  });

  it('홈으로 버튼 클릭 시 핸들러가 호출된다', () => {
    render(
      <WorkoutSummaryView
        viewModel={mockViewModel}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '홈으로' }));
    expect(mockHandlers.onGoHome).toHaveBeenCalledTimes(1);
  });

  it('뒤로가기 버튼은 표시되지 않는다', () => {
    render(
      <WorkoutSummaryView
        viewModel={mockViewModel}
        {...mockHandlers}
      />
    );

    expect(screen.queryByRole('button', { name: '뒤로가기' })).not.toBeInTheDocument();
  });
});
