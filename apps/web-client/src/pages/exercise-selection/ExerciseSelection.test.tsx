import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ExerciseSelection } from './ExerciseSelection';
import { resetLocalPresets } from '../preset-selection/presetStore';

// Mock console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {
  // Mock implementation
});

describe('ExerciseSelection', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    resetLocalPresets();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('가슴 운동 목록이 렌더링된다', () => {
    render(
      <MemoryRouter initialEntries={['/exercise-selection/chest']}>
        <Routes>
          <Route path="/exercise-selection/:bodyPart" element={<ExerciseSelection />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('가슴 운동')).toBeInTheDocument();
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('푸쉬업')).toBeInTheDocument();
  });

  it('등 운동 목록이 렌더링된다', () => {
    render(
      <MemoryRouter initialEntries={['/exercise-selection/back']}>
        <Routes>
          <Route path="/exercise-selection/:bodyPart" element={<ExerciseSelection />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('등 운동')).toBeInTheDocument();
    expect(screen.getByText('바벨 로우')).toBeInTheDocument();
    expect(screen.getByText('렛풀다운')).toBeInTheDocument();
  });

  it('유효하지 않은 부위일 때 빈 목록이 표시된다', () => {
    render(
      <MemoryRouter initialEntries={['/exercise-selection/invalid']}>
        <Routes>
          <Route path="/exercise-selection/:bodyPart" element={<ExerciseSelection />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('invalid 운동')).toBeInTheDocument();
    expect(screen.getByText('선택된 부위에 해당하는 운동이 없습니다.')).toBeInTheDocument();
  });

  it('부위 파라미터가 없을 때 기본값으로 가슴 운동이 표시된다', () => {
    render(
      <MemoryRouter initialEntries={['/exercise-selection']}>
        <Routes>
          <Route path="/exercise-selection/:bodyPart?" element={<ExerciseSelection />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('가슴 운동')).toBeInTheDocument();
  });

  it('편집 모드에서는 선택한 루틴의 운동 목록을 표시한다', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/exercise-selection/edit',
            state: { mode: 'edit', presetId: '2' }
          }
        ]}
      >
        <Routes>
          <Route path="/exercise-selection/:bodyPart" element={<ExerciseSelection />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('수정할 운동 선택')).toBeInTheDocument();
    expect(await screen.findByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('바벨 로우')).toBeInTheDocument();
  });
});
