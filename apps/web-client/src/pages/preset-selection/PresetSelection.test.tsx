import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PresetSelection } from './PresetSelection';
import { addLocalPreset, resetLocalPresets } from './presetStore';

const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('PresetSelection', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    resetLocalPresets();
  });
  it('PresetSelection 컴포넌트가 올바르게 렌더링된다', () => {
    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    expect(screen.getByText('운동 루틴 선택')).toBeInTheDocument();
    expect(screen.getByText('전신 운동')).toBeInTheDocument();
    expect(screen.getByText('상체 집중')).toBeInTheDocument();
  });

  it('프리셋 선택 시 콘솔에 로그가 출력된다', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    const presetCard = screen.getByText('전신 운동');
    await user.click(presetCard);

    expect(consoleSpy).toHaveBeenCalledWith('선택된 프리셋:', '1');
    expect(mockNavigate).toHaveBeenCalledWith(
      '/workout',
      expect.objectContaining({
        state: expect.objectContaining({
          presetId: '1',
          presetTitle: '전신 운동',
          exercises: expect.arrayContaining([
            expect.objectContaining({
              exerciseId: '1',
              exerciseName: '스쿼트',
              bodyPart: '전신',
              sets: 3,
            }),
          ]),
        }),
      })
    );

    consoleSpy.mockRestore();
  });

  it('루틴 만들기 버튼 클릭 시 루틴 생성 화면으로 라우팅된다', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '루틴 만들기' });
    await user.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith('/create-routine');
  });

  it('로컬 저장된 새 루틴이 프리셋 목록에 표시된다', () => {
    addLocalPreset('새로 만든 루틴', [
      {
        exerciseId: 'bench-press',
        exerciseName: '벤치프레스',
        bodyPart: 'chest',
        sets: 3,
        weight: 20
      }
    ]);

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    expect(screen.getByText('새로 만든 루틴')).toBeInTheDocument();
  });
}); 
