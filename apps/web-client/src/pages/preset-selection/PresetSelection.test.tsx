import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { PresetSelection } from './PresetSelection';
import type { PresetItem } from './presetStore';
import * as presetApi from './presetApi';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const INITIAL_PRESETS: PresetItem[] = [
  {
    id: '1',
    title: '전신 운동',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    exercises: [
      {
        id: 'squat',
        part: 'legs',
        name: '스쿼트',
        sets: 3,
        weight: 50,
        reps: 10,
      },
    ],
  },
  {
    id: '2',
    title: '상체 집중',
    createdAt: new Date('2024-01-02T00:00:00.000Z'),
    exercises: [
      {
        id: 'bench-press',
        part: 'chest',
        name: '벤치프레스',
        sets: 4,
        weight: 80,
        reps: 8,
      },
    ],
  },
];

describe('PresetSelection', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.restoreAllMocks();
    jest.spyOn(presetApi, 'fetchPresets').mockResolvedValue([...INITIAL_PRESETS]);
    jest.spyOn(presetApi, 'deletePreset').mockResolvedValue();
  });

  it('PresetSelection 컴포넌트가 올바르게 렌더링된다', () => {
    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    expect(screen.getByText('운동 루틴 선택')).toBeInTheDocument();
  });

  it('프리셋 목록은 서버 API(fetchPresets) 결과를 렌더링한다', async () => {
    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    expect(await screen.findByText('전신 운동')).toBeInTheDocument();
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

    const presetCard = await screen.findByText('전신 운동');
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
              exerciseId: 'squat',
              exerciseName: '스쿼트',
              bodyPart: 'legs',
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

  it('액션 메뉴에서 편집 선택 시 편집 플로우로 이동한다', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: '전신 운동 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '편집' }));

    expect(mockNavigate).toHaveBeenCalledWith('/create-routine', {
      state: { mode: 'edit', presetId: '1' }
    });
  });

  it('액션 메뉴에서 삭제 선택 후 성공하면 목록에서 제거된다', async () => {
    const user = userEvent.setup();
    const deletePresetSpy = jest.spyOn(presetApi, 'deletePreset');
    const fetchPresetsSpy = jest
      .spyOn(presetApi, 'fetchPresets')
      .mockResolvedValueOnce([...INITIAL_PRESETS])
      .mockResolvedValueOnce([INITIAL_PRESETS[1]]);

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: '전신 운동 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(deletePresetSpy).toHaveBeenCalledWith('1');
    expect(fetchPresetsSpy).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('전신 운동')).not.toBeInTheDocument();
  });

  it('삭제 API가 실패하면 목록은 유지된다', async () => {
    const user = userEvent.setup();
    jest.spyOn(presetApi, 'deletePreset').mockRejectedValue(new Error('delete failed'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: '전신 운동 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(screen.getByText('전신 운동')).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('서버에서 새 루틴이 내려오면 목록에 표시된다', async () => {
    jest.spyOn(presetApi, 'fetchPresets').mockResolvedValueOnce([
      ...INITIAL_PRESETS,
      {
        id: '3',
        title: '새로 만든 루틴',
        createdAt: new Date('2024-01-03T00:00:00.000Z'),
        exercises: [
          {
            id: 'push-up',
            part: 'chest',
            name: '푸쉬업',
            sets: 3,
            reps: 12,
          },
        ],
      },
    ]);

    render(
      <MemoryRouter>
        <PresetSelection />
      </MemoryRouter>
    );

    expect(await screen.findByText('새로 만든 루틴')).toBeInTheDocument();
  });
});
