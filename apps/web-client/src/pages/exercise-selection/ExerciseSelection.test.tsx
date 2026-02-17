import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ExerciseSelection } from './ExerciseSelection';
import {
  deleteLocalPresetExercise,
  resetLocalPresets
} from '../preset-selection/presetStore';
import * as presetApi from '../preset-selection/presetApi';
import * as exerciseApi from './exerciseApi';
import { Exercise } from '../../types/exercise';

const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {
  // Mock implementation
});

const fetchExercisesByBodyPartSpy = jest.spyOn(exerciseApi, 'fetchExercisesByBodyPart');

const EXERCISE_FIXTURES: Record<string, Exercise[]> = {
  chest: [
    { id: 'bench-press', name: '벤치프레스', bodyPart: 'chest' },
    { id: 'push-up', name: '푸쉬업', bodyPart: 'chest' }
  ],
  back: [
    { id: 'barbell-row', name: '바벨 로우', bodyPart: 'back' },
    { id: 'lat-pulldown', name: '렛풀다운', bodyPart: 'back' }
  ]
};

const renderWithRouter = (
  initialEntry: string | { pathname: string; state?: unknown }
) => {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/exercise-selection/:bodyPart?" element={<ExerciseSelection />} />
        <Route path="/create-routine" element={<div>create-routine-page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ExerciseSelection', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
    resetLocalPresets();
    fetchExercisesByBodyPartSpy.mockReset();
    fetchExercisesByBodyPartSpy.mockImplementation(async (bodyPartId: string) => {
      return EXERCISE_FIXTURES[bodyPartId] ?? [];
    });
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('가슴 운동 목록을 API 조회 결과로 렌더링한다', async () => {
    renderWithRouter('/exercise-selection/chest');

    expect(screen.getByText('가슴 운동')).toBeInTheDocument();
    expect(fetchExercisesByBodyPartSpy).toHaveBeenCalledWith('chest');
    expect(await screen.findByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('푸쉬업')).toBeInTheDocument();
  });

  it('등 운동 목록을 API 조회 결과로 렌더링한다', async () => {
    renderWithRouter('/exercise-selection/back');

    expect(screen.getByText('등 운동')).toBeInTheDocument();
    expect(fetchExercisesByBodyPartSpy).toHaveBeenCalledWith('back');
    expect(await screen.findByText('바벨 로우')).toBeInTheDocument();
    expect(screen.getByText('렛풀다운')).toBeInTheDocument();
  });

  it('유효하지 않은 부위일 때 빈 목록이 표시된다', async () => {
    renderWithRouter('/exercise-selection/invalid');

    expect(screen.getByText('invalid 운동')).toBeInTheDocument();
    expect(
      await screen.findByText('선택된 부위에 해당하는 운동이 없습니다.')
    ).toBeInTheDocument();
  });

  it('부위 파라미터가 없을 때 기본값으로 가슴 운동이 표시된다', async () => {
    renderWithRouter('/exercise-selection');

    expect(screen.getByText('가슴 운동')).toBeInTheDocument();
    await waitFor(() => {
      expect(fetchExercisesByBodyPartSpy).toHaveBeenCalledWith('chest');
    });
  });

  it('조회 실패 시 에러를 보여주고 재시도로 다시 조회한다', async () => {
    const user = userEvent.setup();
    fetchExercisesByBodyPartSpy
      .mockRejectedValueOnce(new Error('request failed'))
      .mockResolvedValueOnce(EXERCISE_FIXTURES.chest);

    renderWithRouter('/exercise-selection/chest');

    expect(
      await screen.findByText('운동 목록을 불러오지 못했습니다.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    await waitFor(() => {
      expect(fetchExercisesByBodyPartSpy).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByText('벤치프레스')).toBeInTheDocument();
  });

  it('편집 모드에서는 선택한 루틴의 운동 목록을 표시하고 서버 조회를 건너뛴다', async () => {
    renderWithRouter({
      pathname: '/exercise-selection/edit',
      state: { mode: 'edit', presetId: '2' }
    });

    expect(screen.getByText('수정할 운동 선택')).toBeInTheDocument();
    expect(await screen.findByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('바벨 로우')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '벤치프레스 관리 메뉴' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '새 운동 추가하기' })).toBeInTheDocument();
    expect(fetchExercisesByBodyPartSpy).not.toHaveBeenCalled();
  });

  it('편집 모드에서 새 운동 추가하기 클릭 시 부위 선택 화면으로 이동한다', async () => {
    const user = userEvent.setup();
    renderWithRouter({
      pathname: '/exercise-selection/edit',
      state: { mode: 'edit', presetId: '2' }
    });

    await user.click(await screen.findByRole('button', { name: '새 운동 추가하기' }));
    expect(await screen.findByText('create-routine-page')).toBeInTheDocument();
  });

  it('edit-add 모드에서는 기존 루틴 운동을 제외한 목록만 표시한다', async () => {
    renderWithRouter({
      pathname: '/exercise-selection/chest',
      state: { mode: 'edit-add', presetId: '2' }
    });

    expect(screen.getByText('추가할 운동 선택')).toBeInTheDocument();
    expect(await screen.findByText('푸쉬업')).toBeInTheDocument();
    expect(screen.queryByText('벤치프레스')).not.toBeInTheDocument();
  });

  it('편집 모드에서 운동 삭제를 선택하면 목록에서 제거된다', async () => {
    const user = userEvent.setup();
    const deleteSpy = jest
      .spyOn(presetApi, 'deletePresetExercise')
      .mockImplementation(async (presetId: string, exerciseId: string) => {
        return deleteLocalPresetExercise(presetId, exerciseId);
      });

    renderWithRouter({
      pathname: '/exercise-selection/edit',
      state: { mode: 'edit', presetId: '2' }
    });

    await user.click(await screen.findByRole('button', { name: '벤치프레스 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(deleteSpy).toHaveBeenCalledWith('2', 'bench-press');
    expect(screen.queryByText('벤치프레스')).not.toBeInTheDocument();
    expect(screen.getByText('바벨 로우')).toBeInTheDocument();
    expect(fetchExercisesByBodyPartSpy).not.toHaveBeenCalled();

    deleteSpy.mockRestore();
  });

  it('편집 모드에서 운동 삭제 API가 실패하면 에러를 표시하고 목록을 유지한다', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const deleteSpy = jest
      .spyOn(presetApi, 'deletePresetExercise')
      .mockRejectedValue(new Error('delete failed'));

    renderWithRouter({
      pathname: '/exercise-selection/edit',
      state: { mode: 'edit', presetId: '2' }
    });

    await user.click(await screen.findByRole('button', { name: '벤치프레스 관리 메뉴' }));
    await user.click(screen.getByRole('button', { name: '삭제' }));

    expect(deleteSpy).toHaveBeenCalledWith('2', 'bench-press');
    expect(await screen.findByText('운동 삭제에 실패했습니다.')).toBeInTheDocument();
    expect(screen.getByText('벤치프레스')).toBeInTheDocument();
    expect(screen.getByText('바벨 로우')).toBeInTheDocument();

    deleteSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
