import {
  appendPresetExercise,
  createPreset,
  deletePresetExercise,
  fetchPresetById,
  fetchPresets,
  updatePresetExercise
} from './presetApi';
import { resetLocalPresets } from './presetStore';
import { ExerciseDetail } from '../../types/exercise';

const originalFetch = global.fetch;

const createStrengthExercise = (
  overrides: Partial<ExerciseDetail> = {}
): ExerciseDetail => ({
  exerciseId: 'bench-press',
  exerciseName: '벤치프레스',
  bodyPart: 'chest',
  sets: 3,
  weight: 80,
  reps: 8,
  restTime: 60,
  setDetails: [
    { setNumber: 1, weight: 80, reps: 8 },
    { setNumber: 2, weight: 80, reps: 8 },
    { setNumber: 3, weight: 80, reps: 8 }
  ],
  ...overrides
});

describe('presetApi guest mode', () => {
  beforeEach(() => {
    localStorage.clear();
    resetLocalPresets();
    global.fetch = jest.fn() as unknown as typeof fetch;
    localStorage.setItem('health-clock.session-mode', 'guest');
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('게스트 모드에서는 fetchPresets가 로컬 스토리지를 조회한다', async () => {
    const presets = await fetchPresets();

    expect(presets.length).toBeGreaterThan(0);
    expect((global.fetch as jest.Mock)).not.toHaveBeenCalled();
  });

  it('게스트 모드에서 루틴 생성 후 조회 시 새 루틴이 포함된다', async () => {
    const response = await createPreset('게스트 루틴', [createStrengthExercise()]);

    expect(response.id).toContain('guest-routine');
    const created = await fetchPresetById(response.id);
    expect(created).toBeDefined();
    expect(created?.title).toBe('게스트 루틴');
    expect((global.fetch as jest.Mock)).not.toHaveBeenCalled();
  });

  it('게스트 모드에서 운동 수정/추가/삭제가 로컬에서 동작한다', async () => {
    const updated = await updatePresetExercise(
      '2',
      'bench-press',
      createStrengthExercise({
        weight: 90,
        setDetails: [
          { setNumber: 1, weight: 90, reps: 8 },
          { setNumber: 2, weight: 90, reps: 8 },
          { setNumber: 3, weight: 90, reps: 8 }
        ]
      })
    );
    expect(updated?.exercises.find((exercise) => exercise.name === '벤치프레스')?.weight).toBe(90);

    const appendResponse = await appendPresetExercise(
      '2',
      createStrengthExercise({
        exerciseId: 'push-up',
        exerciseName: '푸쉬업',
        weight: 0,
        reps: 12
      })
    );

    const withAppended = await fetchPresetById('2');
    expect(withAppended?.exercises.some((exercise) => exercise.id === appendResponse.id)).toBe(true);

    await deletePresetExercise('2', appendResponse.id);
    const afterDelete = await fetchPresetById('2');
    expect(afterDelete?.exercises.some((exercise) => exercise.id === appendResponse.id)).toBe(false);
    expect((global.fetch as jest.Mock)).not.toHaveBeenCalled();
  });
});

describe('presetApi authenticated mode', () => {
  beforeEach(() => {
    localStorage.clear();
    resetLocalPresets();
    localStorage.setItem('health-clock.session-mode', 'authenticated');
    localStorage.setItem(
      'health-clock.google-auth',
      JSON.stringify({
        accessToken: 'token-1',
        tokenType: 'Bearer'
      })
    );
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => []
    }) as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('인증 모드에서는 서버 API를 호출한다', async () => {
    await fetchPresets();

    expect(global.fetch).toHaveBeenCalledWith('/api/routines', {
      headers: {
        Authorization: 'Bearer token-1'
      }
    });
  });
});
