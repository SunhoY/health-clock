import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ExerciseSelectionView } from './ExerciseSelectionView';
import { Exercise } from '../../types/exercise';
import { deletePresetExercise, fetchPresetById } from '../preset-selection/presetApi';
import { PresetExercise } from '../preset-selection/presetStore';
import { fetchExercisesByBodyPart } from './exerciseApi';

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

  const normalizedBodyPart =
    bodyPartAlias[presetExercise.part] ?? presetExercise.part;
  const normalizedExerciseName =
    exerciseNameAlias[presetExercise.name] ?? presetExercise.name;

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
  const [createExercises, setCreateExercises] = useState<Exercise[]>([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createLoadError, setCreateLoadError] = useState<string | null>(null);

  const selectedBodyPart = bodyPart || 'chest';
  const exercises = useMemo(() => {
    if (isEditMode) {
      return editExercises;
    }

    return createExercises;
  }, [createExercises, editExercises, isEditMode]);

  const loadCreateExercises = useCallback(async (targetBodyPart: string) => {
    setIsCreateLoading(true);
    setCreateLoadError(null);

    try {
      const response = await fetchExercisesByBodyPart(targetBodyPart);
      setCreateExercises(response);
    } catch (error) {
      console.error('운동 목록 조회에 실패했습니다.', error);
      setCreateExercises([]);
      setCreateLoadError('운동 목록을 불러오지 못했습니다.');
    } finally {
      setIsCreateLoading(false);
    }
  }, []);

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

  useEffect(() => {
    if (isEditMode) {
      setCreateExercises([]);
      setCreateLoadError(null);
      setIsCreateLoading(false);
      return;
    }

    void loadCreateExercises(selectedBodyPart);
  }, [isEditMode, loadCreateExercises, selectedBodyPart]);

  const handleExerciseSelect = (exercise: Exercise) => {
    navigate(`/exercise-detail/${exercise.bodyPart}/${exercise.id}`, {
      state: {
        mode: isEditMode ? 'edit' : 'create',
        presetId: routeState?.presetId,
        presetExercise: {
          id: exercise.id,
          name: exercise.name,
          part: exercise.bodyPart
        }
      }
    });
  };

  const handleDeleteExercise = async (exercise: Exercise) => {
    if (!routeState?.presetId) {
      return;
    }

    await deletePresetExercise(routeState.presetId, exercise.id);
    const nextPreset = await fetchPresetById(routeState.presetId);
    setEditExercises((nextPreset?.exercises ?? []).map(findExerciseByPreset));
  };

  return (
    <ExerciseSelectionView
      selectedBodyPart={selectedBodyPart}
      exercises={exercises}
      title={isEditMode ? '수정할 운동 선택' : undefined}
      emptyMessage={isEditMode ? '수정할 운동이 없습니다.' : undefined}
      onExerciseSelect={handleExerciseSelect}
      isEditMode={isEditMode}
      onEditExercise={handleExerciseSelect}
      onDeleteExercise={isEditMode ? handleDeleteExercise : undefined}
      onBack={isEditMode ? () => navigate(-1) : undefined}
      isLoading={!isEditMode && isCreateLoading}
      loadError={!isEditMode ? createLoadError : null}
      onRetry={
        isEditMode
          ? undefined
          : () => {
              void loadCreateExercises(selectedBodyPart);
            }
      }
    />
  );
}
