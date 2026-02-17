import { ExerciseDetail, StrengthExerciseSetViewModel } from '../../types/exercise';

export interface PresetExercise {
  id: string;
  exerciseCode?: string;
  part: string;
  name: string;
  sets: number;
  weight?: number;
  reps?: number;
  duration?: number;
  setDetails?: StrengthExerciseSetViewModel[];
}

export interface PresetItem {
  id: string;
  title: string;
  exercises: PresetExercise[];
  createdAt: Date;
  lastUsed?: Date;
}

const GUEST_PRESETS_STORAGE_KEY = 'health-clock.guest-presets';

export type PresetCacheSource = 'guest' | 'server';

const INITIAL_PRESETS: PresetItem[] = [
  {
    id: '1',
    title: '전신 운동',
    exercises: [
      {
        id: 'squat',
        part: 'legs',
        name: '스쿼트',
        sets: 3,
        weight: 50,
        reps: 10,
        setDetails: [
          { setNumber: 1, weight: 50, reps: 10 },
          { setNumber: 2, weight: 50, reps: 10 },
          { setNumber: 3, weight: 50, reps: 10 }
        ]
      },
      {
        id: 'push-up',
        part: 'chest',
        name: '푸쉬업',
        sets: 3,
        weight: 0,
        reps: 12,
        setDetails: [
          { setNumber: 1, weight: 0, reps: 12 },
          { setNumber: 2, weight: 0, reps: 12 },
          { setNumber: 3, weight: 0, reps: 12 }
        ]
      },
      {
        id: 'lunge',
        part: 'legs',
        name: '런지',
        sets: 3,
        weight: 20,
        reps: 12,
        setDetails: [
          { setNumber: 1, weight: 20, reps: 12 },
          { setNumber: 2, weight: 20, reps: 12 },
          { setNumber: 3, weight: 20, reps: 12 }
        ]
      }
    ],
    createdAt: new Date('2024-01-01'),
    lastUsed: new Date('2024-01-15')
  },
  {
    id: '2',
    title: '상체 집중',
    exercises: [
      {
        id: 'bench-press',
        part: 'chest',
        name: '벤치프레스',
        sets: 4,
        weight: 80,
        reps: 8,
        setDetails: [
          { setNumber: 1, weight: 80, reps: 8 },
          { setNumber: 2, weight: 80, reps: 8 },
          { setNumber: 3, weight: 80, reps: 8 },
          { setNumber: 4, weight: 80, reps: 8 }
        ]
      },
      {
        id: 'barbell-row',
        part: 'back',
        name: '바벨 로우',
        sets: 4,
        weight: 60,
        reps: 10,
        setDetails: [
          { setNumber: 1, weight: 60, reps: 10 },
          { setNumber: 2, weight: 60, reps: 10 },
          { setNumber: 3, weight: 60, reps: 10 },
          { setNumber: 4, weight: 60, reps: 10 }
        ]
      },
      {
        id: 'shoulder-press',
        part: 'shoulders',
        name: '숄더프레스',
        sets: 3,
        weight: 40,
        reps: 10,
        setDetails: [
          { setNumber: 1, weight: 40, reps: 10 },
          { setNumber: 2, weight: 40, reps: 10 },
          { setNumber: 3, weight: 40, reps: 10 }
        ]
      }
    ],
    createdAt: new Date('2024-01-10'),
    lastUsed: new Date('2024-01-20')
  }
];

let localPresets: PresetItem[] = [];

let presetCacheSource: PresetCacheSource = 'guest';

interface SerializedPresetItem extends Omit<PresetItem, 'createdAt' | 'lastUsed'> {
  createdAt: string;
  lastUsed?: string;
}

const toDate = (value: string | undefined): Date | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
};

const toSerializedPreset = (preset: PresetItem): SerializedPresetItem => ({
  ...preset,
  createdAt: preset.createdAt.toISOString(),
  lastUsed: preset.lastUsed?.toISOString()
});

const deserializePreset = (preset: SerializedPresetItem): PresetItem => ({
  ...preset,
  createdAt: toDate(preset.createdAt) ?? new Date(),
  lastUsed: toDate(preset.lastUsed)
});

const readGuestPresets = (): PresetItem[] | null => {
  const raw = localStorage.getItem(GUEST_PRESETS_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SerializedPresetItem[];
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.map(deserializePreset);
  } catch {
    return null;
  }
};

const isLegacySeedPreset = (preset: PresetItem, seed: PresetItem): boolean => {
  return (
    preset.id === seed.id &&
    preset.title === seed.title &&
    preset.exercises.length === seed.exercises.length &&
    preset.exercises.every((exercise, index) => {
      const seedExercise = seed.exercises[index];
      return (
        exercise.id === seedExercise.id &&
        exercise.name === seedExercise.name &&
        exercise.part === seedExercise.part
      );
    })
  );
};

const isLegacySeedPresetList = (presets: PresetItem[]): boolean => {
  if (presets.length !== INITIAL_PRESETS.length) {
    return false;
  }

  return presets.every((preset, index) =>
    isLegacySeedPreset(preset, INITIAL_PRESETS[index])
  );
};

const persistGuestPresets = () => {
  localStorage.setItem(
    GUEST_PRESETS_STORAGE_KEY,
    JSON.stringify(localPresets.map(toSerializedPreset))
  );
};

const createRandomId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const commitLocalPresets = (nextPresets: PresetItem[]) => {
  localPresets = nextPresets;
  if (presetCacheSource === 'guest') {
    persistGuestPresets();
  }
};

const toPresetExercise = (exercise: ExerciseDetail, index: number): PresetExercise => ({
  id: `${exercise.exerciseId}-${index + 1}`,
  exerciseCode: exercise.exerciseId,
  part: exercise.bodyPart,
  name: exercise.exerciseName,
  sets: exercise.sets,
  weight: exercise.weight,
  reps: exercise.reps,
  duration: exercise.duration,
  setDetails: exercise.setDetails
});

export const getPresetCacheSource = (): PresetCacheSource => {
  return presetCacheSource;
};

export const loadGuestPresets = (): PresetItem[] => {
  const persisted = readGuestPresets();
  if (!persisted) {
    localPresets = [];
    presetCacheSource = 'guest';
    persistGuestPresets();
    return localPresets;
  }

  if (process.env.NODE_ENV !== 'test' && isLegacySeedPresetList(persisted)) {
    localPresets = [];
    presetCacheSource = 'guest';
    persistGuestPresets();
    return localPresets;
  }

  localPresets = [...persisted];
  presetCacheSource = 'guest';
  return localPresets;
};

export const getLocalPresets = (): PresetItem[] => {
  return localPresets;
};

export const addLocalPreset = (title: string, exercises: ExerciseDetail[]) => {
  const next: PresetItem = {
    id: createRandomId('guest-routine'),
    title,
    exercises: exercises.map(toPresetExercise),
    createdAt: new Date()
  };

  commitLocalPresets([next, ...localPresets]);
  return next;
};

export const deleteLocalPreset = (presetId: string) => {
  commitLocalPresets(localPresets.filter((preset) => preset.id !== presetId));
};

export const getLocalPresetById = (presetId: string): PresetItem | undefined => {
  return localPresets.find((preset) => preset.id === presetId);
};

export const updateLocalPresetExercise = (
  presetId: string,
  exercise: ExerciseDetail
): PresetItem | undefined => {
  const targetPreset = localPresets.find((preset) => preset.id === presetId);
  if (!targetPreset) {
    return undefined;
  }

  const exerciseIndex = targetPreset.exercises.findIndex(
    (presetExercise) =>
      presetExercise.id === exercise.exerciseId ||
      presetExercise.name === exercise.exerciseName
  );

  if (exerciseIndex < 0) {
    return undefined;
  }

  const nextExercise: PresetExercise = {
    ...targetPreset.exercises[exerciseIndex],
    exerciseCode: exercise.exerciseId,
    part: exercise.bodyPart,
    name: exercise.exerciseName,
    sets: exercise.sets,
    weight: exercise.weight,
    reps: exercise.reps,
    duration: exercise.duration,
    setDetails: exercise.setDetails
  };

  commitLocalPresets(localPresets.map((preset) => {
    if (preset.id !== presetId) {
      return preset;
    }

    const nextExercises = [...preset.exercises];
    nextExercises[exerciseIndex] = nextExercise;
    return {
      ...preset,
      exercises: nextExercises
    };
  }));

  return localPresets.find((preset) => preset.id === presetId);
};

export const appendLocalPresetExercise = (
  presetId: string,
  exercise: ExerciseDetail
): PresetExercise | undefined => {
  const targetPreset = localPresets.find((preset) => preset.id === presetId);
  if (!targetPreset) {
    return undefined;
  }

  const nextExercise: PresetExercise = {
    ...toPresetExercise(exercise, targetPreset.exercises.length),
    id: createRandomId('guest-routine-exercise')
  };

  commitLocalPresets(localPresets.map((preset) => {
    if (preset.id !== presetId) {
      return preset;
    }

    return {
      ...preset,
      exercises: [...preset.exercises, nextExercise]
    };
  }));

  return nextExercise;
};

export const deleteLocalPresetExercise = (
  presetId: string,
  exerciseId: string
): PresetItem | undefined => {
  const targetPreset = localPresets.find((preset) => preset.id === presetId);
  if (!targetPreset) {
    return undefined;
  }

  commitLocalPresets(localPresets.map((preset) => {
    if (preset.id !== presetId) {
      return preset;
    }

    return {
      ...preset,
      exercises: preset.exercises.filter((exercise) => exercise.id !== exerciseId)
    };
  }));

  return localPresets.find((preset) => preset.id === presetId);
};

export const resetLocalPresets = () => {
  presetCacheSource = 'guest';
  localPresets = [...INITIAL_PRESETS];
  persistGuestPresets();
};

export const replaceLocalPresets = (nextPresets: PresetItem[]) => {
  presetCacheSource = 'guest';
  localPresets = [...nextPresets];
  persistGuestPresets();
};

export const replaceServerPresetCache = (nextPresets: PresetItem[]) => {
  presetCacheSource = 'server';
  localPresets = [...nextPresets];
};
