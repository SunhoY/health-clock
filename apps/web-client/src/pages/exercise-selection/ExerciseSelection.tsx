import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ExerciseSelectionView } from './ExerciseSelectionView';
import { EXERCISES_DATA } from '../../types/exercise';
import { Exercise } from '../../types/exercise';
import { fetchPresetById } from '../preset-selection/presetApi';
import { useEffect, useMemo, useState } from 'react';
import { PresetExercise } from '../preset-selection/presetStore';

interface ExerciseSelectionRouteState {
  mode?: 'create' | 'edit';
  presetId?: string;
}

const findExerciseByPreset = (presetExercise: PresetExercise): Exercise => {
  const bodyPartAlias: Record<string, string> = {
    가슴: 'chest',
    상체: 'chest',
    등: 'back',
    하체: 'legs',
    어깨: 'shoulders',
    팔: 'arms',
    복부: 'abs',
    코어: 'abs',
    종아리: 'calves',
    전신: 'fullbody',
    유산소: 'cardio'
  };
  const exerciseNameAlias: Record<string, string> = {
    푸시업: '푸쉬업',
    랫풀다운: '렛풀다운'
  };

  const normalizedBodyPart = bodyPartAlias[presetExercise.part] ?? presetExercise.part;
  const normalizedExerciseName =
    exerciseNameAlias[presetExercise.name] ?? presetExercise.name;
  const byBodyPart = EXERCISES_DATA[presetExercise.part] || [];
  const inBodyPart = EXERCISES_DATA[normalizedBodyPart] || byBodyPart;
  const byName = inBodyPart.find((exercise) => exercise.name === normalizedExerciseName);
  if (byName) {
    return byName;
  }

  const byAll = Object.values(EXERCISES_DATA)
    .flat()
    .find(
      (exercise) =>
        exercise.name === presetExercise.name ||
        exercise.name === normalizedExerciseName ||
        exercise.name.includes(presetExercise.name) ||
        presetExercise.name.includes(exercise.name)
    );

  if (byAll) {
    return byAll;
  }

  return {
    id: presetExercise.id,
    name: normalizedExerciseName,
    bodyPart: normalizedBodyPart
  };
};

export function ExerciseSelection() {
  const { bodyPart } = useParams<{ bodyPart: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as ExerciseSelectionRouteState | null) ?? null;
  const isEditMode = routeState?.mode === 'edit' && Boolean(routeState?.presetId);
  const [editExercises, setEditExercises] = useState<Exercise[]>([]);

  const selectedBodyPart = bodyPart || 'chest';
  const exercises = useMemo(() => {
    if (isEditMode) {
      return editExercises;
    }

    return EXERCISES_DATA[selectedBodyPart] || [];
  }, [editExercises, isEditMode, selectedBodyPart]);

  useEffect(() => {
    let mounted = true;

    if (!isEditMode || !routeState?.presetId) {
      setEditExercises([]);
      return () => {
        mounted = false;
      };
    }

    fetchPresetById(routeState.presetId).then((preset) => {
      if (!mounted || !preset) {
        return;
      }

      setEditExercises(preset.exercises.map(findExerciseByPreset));
    });

    return () => {
      mounted = false;
    };
  }, [isEditMode, routeState?.presetId]);

  const handleExerciseSelect = (exercise: Exercise) => {
    console.log('Selected exercise:', exercise);
    navigate(`/exercise-detail/${exercise.bodyPart}/${exercise.id}`, {
      state: {
        mode: isEditMode ? 'edit' : 'create',
        presetId: routeState?.presetId,
        presetExercise: isEditMode
          ? {
              id: exercise.id,
              name: exercise.name,
              part: exercise.bodyPart
            }
          : undefined
      }
    });
  };

  return (
    <ExerciseSelectionView
      selectedBodyPart={selectedBodyPart}
      exercises={exercises}
      title={isEditMode ? '수정할 운동 선택' : undefined}
      emptyMessage={isEditMode ? '수정할 운동이 없습니다.' : undefined}
      onExerciseSelect={handleExerciseSelect}
    />
  );
} 
