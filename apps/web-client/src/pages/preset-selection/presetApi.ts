import { ExerciseDetail } from '../../types/exercise';
import {
  deleteLocalPresetExercise,
  deleteLocalPreset,
  getLocalPresetById,
  getLocalPresets,
  PresetItem,
  replaceLocalPresets,
  updateLocalPresetExercise
} from './presetStore';

const AUTH_STORAGE_KEY = 'health-clock.google-auth';

interface StoredAuthSession {
  accessToken?: string;
  tokenType?: string;
}

interface RoutineExerciseApiResponse {
  id: string;
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
  exercise: ExerciseDetail
): Promise<PresetItem | undefined> => {
  return updateLocalPresetExercise(presetId, exercise);
};

export const deletePresetExercise = async (
  presetId: string,
  exerciseId: string
): Promise<PresetItem | undefined> => {
  return deleteLocalPresetExercise(presetId, exerciseId);
};

export const getPresetCache = (): PresetItem[] => {
  return getLocalPresets();
};
