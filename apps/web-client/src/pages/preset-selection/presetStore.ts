import { ExerciseDetail } from '../../types/exercise';

export interface PresetExercise {
  id: string;
  part: string;
  name: string;
  sets: number;
  weight?: number;
  duration?: number;
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
      { id: '1', part: '전신', name: '스쿼트', sets: 3, weight: 50 },
      { id: '2', part: '상체', name: '푸시업', sets: 3 },
      { id: '3', part: '하체', name: '런지', sets: 3, weight: 20 }
    ],
    createdAt: new Date('2024-01-01'),
    lastUsed: new Date('2024-01-15')
  },
  {
    id: '2',
    title: '상체 집중',
    exercises: [
      { id: '4', part: '가슴', name: '벤치프레스', sets: 4, weight: 80 },
      { id: '5', part: '등', name: '로우', sets: 4, weight: 60 },
      { id: '6', part: '어깨', name: '밀리터리프레스', sets: 3, weight: 40 }
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
  duration: exercise.duration
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

export const resetLocalPresets = () => {
  localPresets = [...INITIAL_PRESETS];
};
