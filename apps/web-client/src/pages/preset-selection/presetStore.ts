import { ExerciseDetail, StrengthExerciseSetViewModel } from '../../types/exercise';

export interface PresetExercise {
  id: string;
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

let localPresets: PresetItem[] = [...INITIAL_PRESETS];

const toPresetExercise = (exercise: ExerciseDetail, index: number): PresetExercise => ({
  id: `${exercise.exerciseId}-${index + 1}`,
  part: exercise.bodyPart,
  name: exercise.exerciseName,
  sets: exercise.sets,
  weight: exercise.weight,
  reps: exercise.reps,
  duration: exercise.duration,
  setDetails: exercise.setDetails
});

export const getLocalPresets = (): PresetItem[] => {
  return localPresets;
};

export const addLocalPreset = (title: string, exercises: ExerciseDetail[]) => {
  const next: PresetItem = {
    id: String(localPresets.length + 1),
    title,
    exercises: exercises.map(toPresetExercise),
    createdAt: new Date()
  };

  localPresets = [next, ...localPresets];
  return next;
};

export const deleteLocalPreset = (presetId: string) => {
  localPresets = localPresets.filter((preset) => preset.id !== presetId);
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
    part: exercise.bodyPart,
    name: exercise.exerciseName,
    sets: exercise.sets,
    weight: exercise.weight,
    reps: exercise.reps,
    duration: exercise.duration,
    setDetails: exercise.setDetails
  };

  localPresets = localPresets.map((preset) => {
    if (preset.id !== presetId) {
      return preset;
    }

    const nextExercises = [...preset.exercises];
    nextExercises[exerciseIndex] = nextExercise;
    return {
      ...preset,
      exercises: nextExercises
    };
  });

  return localPresets.find((preset) => preset.id === presetId);
};

export const deleteLocalPresetExercise = (
  presetId: string,
  exerciseId: string
): PresetItem | undefined => {
  const targetPreset = localPresets.find((preset) => preset.id === presetId);
  if (!targetPreset) {
    return undefined;
  }

  localPresets = localPresets.map((preset) => {
    if (preset.id !== presetId) {
      return preset;
    }

    return {
      ...preset,
      exercises: preset.exercises.filter((exercise) => exercise.id !== exerciseId)
    };
  });

  return localPresets.find((preset) => preset.id === presetId);
};

export const resetLocalPresets = () => {
  localPresets = [...INITIAL_PRESETS];
};

export const replaceLocalPresets = (nextPresets: PresetItem[]) => {
  localPresets = [...nextPresets];
};
