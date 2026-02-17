import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  ExerciseSelectionItem,
  ExerciseSelectionView
} from './ExerciseSelectionView';
import { deletePresetExercise, fetchPresetById } from '../preset-selection/presetApi';
import { PresetExercise } from '../preset-selection/presetStore';
import { fetchExercisesByBodyPart } from './exerciseApi';

interface ExerciseSelectionRouteState {
  mode?: 'create' | 'edit' | 'edit-add';
  presetId?: string;
}

const findExerciseByPreset = (
  presetExercise: PresetExercise
): ExerciseSelectionItem => {
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
  const exerciseCode = presetExercise.exerciseCode ?? presetExercise.id;

  return {
    id: presetExercise.id,
    routineExerciseId: presetExercise.id,
    exerciseCode,
    name: normalizedExerciseName,
    bodyPart: normalizedBodyPart
  };
};

export function ExerciseSelection() {
  const { bodyPart } = useParams<{ bodyPart: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as ExerciseSelectionRouteState | null) ?? null;
  const mode = routeState?.mode ?? 'create';
  const presetId = routeState?.presetId;
  const isEditUpdateMode = mode === 'edit' && Boolean(presetId);
  const isEditAddMode = mode === 'edit-add' && Boolean(presetId);
  const isEditMode = isEditUpdateMode || isEditAddMode;
  const [editExercises, setEditExercises] = useState<ExerciseSelectionItem[]>([]);
  const [createExercises, setCreateExercises] = useState<ExerciseSelectionItem[]>([]);
  const [existingExerciseCodes, setExistingExerciseCodes] = useState<string[]>([]);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [createLoadError, setCreateLoadError] = useState<string | null>(null);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const selectedBodyPart = bodyPart || 'chest';
  const exercises = useMemo(() => {
    if (isEditUpdateMode) {
      return editExercises;
    }

    if (!isEditAddMode) {
      return createExercises;
    }

    if (existingExerciseCodes.length === 0) {
      return createExercises;
    }

    const excluded = new Set(existingExerciseCodes);
    return createExercises.filter((exercise) => !excluded.has(exercise.id));
  }, [createExercises, editExercises, existingExerciseCodes, isEditAddMode, isEditUpdateMode]);

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

  const loadEditExercises = useCallback(async (targetPresetId: string) => {
    const preset = await fetchPresetById(targetPresetId);
    const nextExercises = (preset?.exercises ?? []).map(findExerciseByPreset);

    setEditExercises(nextExercises);
    setExistingExerciseCodes(
      nextExercises.map((exercise) => exercise.exerciseCode ?? exercise.id)
    );
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!isEditUpdateMode || !presetId) {
      setEditExercises([]);
      setDeleteError(null);
      setIsDeletePending(false);
      return () => {
        mounted = false;
      };
    }

    setDeleteError(null);
    loadEditExercises(presetId).catch((error) => {
      if (!mounted) {
        return;
      }

      console.error('편집 운동 목록 조회에 실패했습니다.', error);
      setEditExercises([]);
    });

    return () => {
      mounted = false;
    };
  }, [isEditUpdateMode, loadEditExercises, presetId]);

  useEffect(() => {
    if (isEditUpdateMode) {
      setCreateExercises([]);
      setCreateLoadError(null);
      setIsCreateLoading(false);
      return;
    }

    void loadCreateExercises(selectedBodyPart);
  }, [isEditUpdateMode, loadCreateExercises, selectedBodyPart]);

  useEffect(() => {
    if (!isEditAddMode || !presetId) {
      setExistingExerciseCodes([]);
      return;
    }

    fetchPresetById(presetId)
      .then((preset) => {
        setExistingExerciseCodes(
          (preset?.exercises ?? []).map(
            (exercise) => exercise.exerciseCode ?? exercise.id
          )
        );
      })
      .catch((error) => {
        console.error('편집 루틴 기존 운동 조회에 실패했습니다.', error);
        setExistingExerciseCodes([]);
      });
  }, [isEditAddMode, presetId]);

  const handleExerciseSelect = (exercise: ExerciseSelectionItem) => {
    const exerciseCode = exercise.exerciseCode ?? exercise.id;
    const routineExerciseId = exercise.routineExerciseId ?? exercise.id;

    navigate(`/exercise-detail/${exercise.bodyPart}/${exerciseCode}`, {
      state: {
        mode: isEditAddMode ? 'edit-add' : isEditUpdateMode ? 'edit' : 'create',
        presetId,
        presetExercise: isEditMode
          ? {
              id: routineExerciseId,
              name: exercise.name,
              part: exercise.bodyPart,
              exerciseCode
            }
          : undefined
      }
    });
  };

  const handleDeleteExercise = async (exercise: ExerciseSelectionItem) => {
    if (!presetId || isDeletePending) {
      return;
    }

    const routineExerciseId = exercise.routineExerciseId ?? exercise.id;
    setDeleteError(null);
    setIsDeletePending(true);

    try {
      await deletePresetExercise(presetId, routineExerciseId);
      await loadEditExercises(presetId);
    } catch (error) {
      console.error('운동 삭제에 실패했습니다.', error);
      setDeleteError('운동 삭제에 실패했습니다.');
    } finally {
      setIsDeletePending(false);
    }
  };

  const handleAddExercise = () => {
    if (!presetId) {
      return;
    }

    navigate('/create-routine', {
      state: {
        mode: 'edit-add',
        presetId
      }
    });
  };

  const title = isEditUpdateMode
    ? '수정할 운동 선택'
    : isEditAddMode
      ? '추가할 운동 선택'
      : undefined;

  const emptyMessage = isEditUpdateMode
    ? '수정할 운동이 없습니다.'
    : isEditAddMode
      ? '추가 가능한 운동이 없습니다.'
      : undefined;

  return (
    <ExerciseSelectionView
      selectedBodyPart={selectedBodyPart}
      exercises={exercises}
      title={title}
      emptyMessage={emptyMessage}
      onExerciseSelect={handleExerciseSelect}
      isEditMode={isEditMode}
      onEditExercise={handleExerciseSelect}
      onDeleteExercise={isEditUpdateMode ? handleDeleteExercise : undefined}
      onAddExercise={isEditUpdateMode ? handleAddExercise : undefined}
      onBack={
        isEditAddMode && presetId
          ? () =>
              navigate('/exercise-selection/edit', {
                replace: true,
                state: { mode: 'edit', presetId }
              })
          : isEditUpdateMode
            ? () => navigate(-1)
            : undefined
      }
      isLoading={!isEditUpdateMode && isCreateLoading}
      loadError={!isEditUpdateMode ? createLoadError : null}
      actionError={isEditUpdateMode ? deleteError : null}
      isDeletePending={isEditUpdateMode && isDeletePending}
      onRetry={
        isEditUpdateMode
          ? undefined
          : () => {
              void loadCreateExercises(selectedBodyPart);
            }
      }
    />
  );
}
