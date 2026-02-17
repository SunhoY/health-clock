import { ExerciseDetail } from '../../types/exercise';
import {
  deleteLocalPresetExercise,
  deleteLocalPreset,
  getLocalPresetById,
  getLocalPresets,
  PresetItem,
  replaceLocalPresets
} from './presetStore';

const AUTH_STORAGE_KEY = 'health-clock.google-auth';

interface StoredAuthSession {
  accessToken?: string;
  tokenType?: string;
}

interface RoutineExerciseApiResponse {
  id: string;
  exerciseCode?: string;
  part: string;
  name: string;
  sets: number;
  weight?: number;
  reps?: number;
  duration?: number;
}

interface RoutineApiResponse {
  id: string;
  title: string;
  exercises: RoutineExerciseApiResponse[];
  createdAt: string;
  lastUsedAt: string | null;
}

interface CreateRoutineResponse {
  id: string;
  title: string;
  exerciseCount: number;
  createdAt: string;
  lastUsedAt: string | null;
}

interface AppendRoutineExerciseResponse {
  id: string;
}

const readAuthSession = (): StoredAuthSession | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredAuthSession;
    return parsed;
  } catch {
    return null;
  }
};

const buildAuthorizationHeader = (): string => {
  const session = readAuthSession();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error('인증 토큰이 없어 루틴 목록을 조회할 수 없습니다.');
  }

  const tokenType = session?.tokenType ?? 'Bearer';
  return `${tokenType} ${accessToken}`;
};

const toFiniteNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const toDate = (raw: string): Date => {
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
};

const toPresetItem = (routine: RoutineApiResponse): PresetItem => ({
  id: routine.id,
  title: routine.title,
  exercises: (routine.exercises ?? []).map((exercise) => ({
    id: exercise.id,
    exerciseCode: exercise.exerciseCode ?? exercise.id,
    part: exercise.part,
    name: exercise.name,
    sets: Math.max(1, Math.trunc(toFiniteNumber(exercise.sets) ?? 1)),
    weight: toFiniteNumber(exercise.weight),
    reps: toFiniteNumber(exercise.reps),
    duration: toFiniteNumber(exercise.duration)
  })),
  createdAt: toDate(routine.createdAt),
  lastUsed: routine.lastUsedAt ? toDate(routine.lastUsedAt) : undefined
});

const toCreateRoutineRequestExercise = (exercise: ExerciseDetail) => ({
  exerciseId: exercise.exerciseId,
  bodyPart: exercise.bodyPart,
  exerciseName: exercise.exerciseName,
  sets: exercise.sets,
  weight: exercise.weight,
  reps: exercise.reps,
  duration: exercise.duration,
  restTime: exercise.restTime,
  setDetails: exercise.setDetails?.map((setDetail) => ({
    setNumber: setDetail.setNumber,
    weight: setDetail.weight,
    reps: setDetail.reps
  }))
});

const tryReadMessage = async (response: Response): Promise<string | undefined> => {
  try {
    const payload = (await response.json()) as { message?: string };
    if (typeof payload === 'object' && payload?.message) {
      return String(payload.message);
    }
  } catch {
    return undefined;
  }

  return undefined;
};

export const fetchPresets = async (): Promise<PresetItem[]> => {
  const response = await fetch('/api/routines', {
    headers: {
      Authorization: buildAuthorizationHeader()
    }
  });

  const payload = (await response.json()) as RoutineApiResponse[] | { message?: string };
  if (!response.ok) {
    const reason =
      typeof payload === 'object' && payload && 'message' in payload
        ? String(payload.message ?? '')
        : '';
    throw new Error(reason || '루틴 목록 조회 요청에 실패했습니다.');
  }

  const routines = Array.isArray(payload) ? payload : [];
  const presets = routines.map(toPresetItem);
  replaceLocalPresets(presets);
  return presets;
};

export const createPreset = async (
  title: string,
  exercises: ExerciseDetail[]
): Promise<CreateRoutineResponse> => {
  const response = await fetch('/api/routines', {
    method: 'POST',
    headers: {
      Authorization: buildAuthorizationHeader(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      exercises: exercises.map(toCreateRoutineRequestExercise)
    })
  });

  if (!response.ok) {
    const reason = await tryReadMessage(response);
    throw new Error(reason || '루틴 저장 요청에 실패했습니다.');
  }

  const payload = (await response.json()) as CreateRoutineResponse;
  return payload;
};

export const deletePreset = async (presetId: string): Promise<void> => {
  const response = await fetch(`/api/routines/${encodeURIComponent(presetId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: buildAuthorizationHeader()
    }
  });

  if (!response.ok) {
    throw new Error('루틴 삭제 요청에 실패했습니다.');
  }

  deleteLocalPreset(presetId);
};

export const fetchPresetById = async (presetId: string): Promise<PresetItem | undefined> => {
  const localPreset = getLocalPresetById(presetId);
  if (localPreset) {
    return localPreset;
  }

  const presets = await fetchPresets();
  return presets.find((preset) => preset.id === presetId);
};

export const updatePresetExercise = async (
  presetId: string,
  routineExerciseId: string,
  exercise: ExerciseDetail
): Promise<PresetItem | undefined> => {
  const response = await fetch(
    `/api/routines/${encodeURIComponent(presetId)}/exercises/${encodeURIComponent(routineExerciseId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: buildAuthorizationHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toCreateRoutineRequestExercise(exercise))
    }
  );

  if (!response.ok) {
    const reason = await tryReadMessage(response);
    throw new Error(reason || '운동 수정 요청에 실패했습니다.');
  }

  const presets = await fetchPresets();
  return presets.find((preset) => preset.id === presetId);
};

export const appendPresetExercise = async (
  presetId: string,
  exercise: ExerciseDetail
): Promise<AppendRoutineExerciseResponse> => {
  const response = await fetch(
    `/api/routines/${encodeURIComponent(presetId)}/exercises`,
    {
      method: 'POST',
      headers: {
        Authorization: buildAuthorizationHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toCreateRoutineRequestExercise(exercise))
    }
  );

  if (!response.ok) {
    const reason = await tryReadMessage(response);
    throw new Error(reason || '운동 추가 요청에 실패했습니다.');
  }

  const payload = (await response.json()) as AppendRoutineExerciseResponse;
  await fetchPresets();
  return payload;
};

export const deletePresetExercise = async (
  presetId: string,
  exerciseId: string
): Promise<PresetItem | undefined> => {
  const response = await fetch(
    `/api/routines/${encodeURIComponent(presetId)}/exercises/${encodeURIComponent(exerciseId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: buildAuthorizationHeader()
      }
    }
  );

  if (!response.ok) {
    const reason = await tryReadMessage(response);
    throw new Error(reason || '운동 삭제 요청에 실패했습니다.');
  }

  return deleteLocalPresetExercise(presetId, exerciseId);
};

export const getPresetCache = (): PresetItem[] => {
  return getLocalPresets();
};
