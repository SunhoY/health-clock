import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExerciseDetailView } from './ExerciseDetailView';
import { EXERCISES_DATA, FORM_CONFIG, Exercise, ExerciseDetail as ExerciseDetailModel, RoutineTitleForm } from '../../types/exercise';
import { RoutineTitleView } from '../routine-title/RoutineTitleView';
import { appendTempRoutineData, getTempRoutineData } from '../routine-title/RoutineTitle';
import { addLocalPreset } from '../preset-selection/presetStore';

interface StrengthSetInput {
  setNumber: number;
  weightInput?: string;
  repsInput?: string;
  weightTouched: boolean;
  repsTouched: boolean;
}

const createStrengthSets = (count: number, previous: StrengthSetInput[] = []): StrengthSetInput[] => {
  return Array.from({ length: count }, (_, index) => {
    const setNumber = index + 1;
    const existing = previous[index];

    return {
      setNumber,
      weightInput: existing?.weightInput,
      repsInput: existing?.repsInput,
      weightTouched: existing?.weightTouched ?? false,
      repsTouched: existing?.repsTouched ?? false
    };
  });
};

const normalizeNumberInput = (value: string): string | undefined => {
  if (!/^\d*$/.test(value)) {
    return undefined;
  }

  if (value === '') {
    return undefined;
  }

  return String(Number(value));
};

const parseNonNegativeInt = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
};

const parsePositiveInt = (value?: string): number | undefined => {
  const parsed = parseNonNegativeInt(value);
  if (parsed === undefined || parsed <= 0) {
    return undefined;
  }

  return parsed;
};

const updateStrengthField = (
  prev: StrengthSetInput[],
  setNumber: number,
  field: 'weight' | 'reps',
  nextValue?: string,
  markTouched = true
): StrengthSetInput[] => {
  const inputKey = field === 'weight' ? 'weightInput' : 'repsInput';
  const touchedKey = field === 'weight' ? 'weightTouched' : 'repsTouched';

  return prev.map((set) => {
    if (set.setNumber === setNumber) {
      return {
        ...set,
        [inputKey]: nextValue,
        [touchedKey]: markTouched ? true : set[touchedKey]
      };
    }

    if (nextValue !== undefined && !set[touchedKey]) {
      return {
        ...set,
        [inputKey]: nextValue
      };
    }

    return set;
  });
};

export function ExerciseDetail() {
  const { bodyPart, exerciseId } = useParams<{ bodyPart: string; exerciseId: string }>();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [setCount, setSetCount] = useState(FORM_CONFIG.sets.default);
  const [strengthSets, setStrengthSets] = useState<StrengthSetInput[]>(createStrengthSets(FORM_CONFIG.sets.default));
  const [durationInput, setDurationInput] = useState(String(FORM_CONFIG.duration.default));
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [pendingCompleteExercise, setPendingCompleteExercise] = useState<ExerciseDetailModel | null>(null);
  const [titleForm, setTitleForm] = useState<RoutineTitleForm>({
    title: '',
    isValid: false,
    error: undefined
  });

  useEffect(() => {
    if (!bodyPart || !exerciseId) {
      setExercise(null);
      return;
    }

    const exercises = EXERCISES_DATA[bodyPart] || [];
    const foundExercise = exercises.find((ex) => ex.id === exerciseId);
    setExercise(foundExercise || null);
  }, [bodyPart, exerciseId]);

  const isCardio = exercise?.bodyPart === 'cardio';

  const durationError = useMemo(() => {
    if (!isCardio) {
      return undefined;
    }

    const duration = parsePositiveInt(durationInput);
    if (duration === undefined) {
      return '시간은 1분 이상의 숫자로 입력해주세요.';
    }

    if (duration > FORM_CONFIG.duration.max) {
      return `시간은 ${FORM_CONFIG.duration.max}분 이하여야 합니다.`;
    }

    return undefined;
  }, [durationInput, isCardio]);

  const strengthErrors = useMemo(() => {
    if (isCardio) {
      return {} as Record<number, { weight?: string; reps?: string }>;
    }

    return strengthSets.reduce<Record<number, { weight?: string; reps?: string }>>((acc, set) => {
      const weight = parseNonNegativeInt(set.weightInput);
      const reps = parseNonNegativeInt(set.repsInput);

      if (weight === undefined || weight > FORM_CONFIG.weight.max) {
        acc[set.setNumber] = {
          ...acc[set.setNumber],
          weight:
            weight === undefined
              ? '중량을 입력해주세요.'
              : `중량은 ${FORM_CONFIG.weight.max}kg 이하여야 합니다.`
        };
      }

      if (reps === undefined || reps > 1000) {
        acc[set.setNumber] = {
          ...acc[set.setNumber],
          reps: reps === undefined ? '횟수를 입력해주세요.' : '횟수는 1000회 이하여야 합니다.'
        };
      }

      return acc;
    }, {});
  }, [isCardio, strengthSets]);

  const isFormValid = useMemo(() => {
    if (isCardio) {
      return !durationError;
    }

    return Object.keys(strengthErrors).length === 0;
  }, [durationError, isCardio, strengthErrors]);

  const handleSetCountChange = (nextCount: number) => {
    const safeCount = Math.max(FORM_CONFIG.sets.min, Math.min(nextCount, FORM_CONFIG.sets.max));
    setSetCount(safeCount);
    setStrengthSets((prev) => createStrengthSets(safeCount, prev));
  };

  const handleStrengthSetChange = (
    setNumber: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const normalized = normalizeNumberInput(value);
    setStrengthSets((prev) => updateStrengthField(prev, setNumber, field, normalized, true));
  };

  const handleStrengthSetStepChange = (
    setNumber: number,
    field: 'weight' | 'reps',
    delta: number
  ) => {
    setStrengthSets((prev) => {
      const target = prev.find((set) => set.setNumber === setNumber);
      if (!target) {
        return prev;
      }

      const inputValue = field === 'weight' ? target.weightInput : target.repsInput;
      const currentValue = parseNonNegativeInt(inputValue) ?? 0;
      const nextValue = Math.max(0, currentValue + delta);
      const normalized = String(nextValue);

      return updateStrengthField(prev, setNumber, field, normalized, true);
    });
  };

  const buildExerciseDetail = (): ExerciseDetailModel | null => {
    if (!exercise) {
      return null;
    }

    if (isCardio) {
      const duration = parsePositiveInt(durationInput);
      if (!duration || durationError) {
        return null;
      }

      return {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        bodyPart: exercise.bodyPart,
        sets: 1,
        duration,
        restTime: 60
      };
    }

    const setDetails = strengthSets.map((set) => ({
      setNumber: set.setNumber,
      weight: parseNonNegativeInt(set.weightInput),
      reps: parseNonNegativeInt(set.repsInput)
    }));

    if (setDetails.some((set) => set.weight === undefined || set.reps === undefined)) {
      return null;
    }

    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      sets: setDetails.length,
      setDetails,
      weight: setDetails[0]?.weight,
      reps: setDetails[0]?.reps,
      restTime: 60
    };
  };

  const validateTitle = (title: string): RoutineTitleForm => {
    const trimmed = title.trim();
    const error = trimmed.length === 0 ? '제목을 입력해주세요' : undefined;

    return {
      title,
      isValid: !error,
      error
    };
  };

  const openTitleDialog = () => {
    const detail = buildExerciseDetail();
    if (!detail) {
      return;
    }

    setPendingCompleteExercise(detail);
    setTitleForm(validateTitle(''));
    setIsTitleDialogOpen(true);
  };

  const handleTitleChange = (title: string) => {
    setTitleForm(validateTitle(title));
  };

  const handleDialogCancel = () => {
    setIsTitleDialogOpen(false);
    setPendingCompleteExercise(null);
  };

  const handleDialogSave = () => {
    if (!pendingCompleteExercise || !titleForm.isValid) {
      return;
    }

    appendTempRoutineData(pendingCompleteExercise);
    const title = titleForm.title.trim();
    const exercises = getTempRoutineData();
    const savedPreset = addLocalPreset(title, exercises);

    console.log('루틴 저장:', savedPreset);
    setIsTitleDialogOpen(false);
    setPendingCompleteExercise(null);
    navigate('/preset-selection');
  };

  const saveCurrentExercise = (mode: 'add' | 'complete') => {
    if (mode === 'complete') {
      openTitleDialog();
      return;
    }

    const detail = buildExerciseDetail();
    if (!detail) {
      return;
    }

    appendTempRoutineData(detail);
    console.log('운동 추가:', detail);
    navigate(`/exercise-selection/${bodyPart ?? detail.bodyPart}`);
  };

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-2xl font-bold">운동을 찾을 수 없습니다</h1>
          <p className="text-gray-400">선택한 운동이 존재하지 않습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ExerciseDetailView
        exercise={exercise}
        isCardio={isCardio}
        setCount={setCount}
        setRange={FORM_CONFIG.sets}
        strengthSets={strengthSets}
        strengthErrors={strengthErrors}
        durationInput={durationInput}
        durationError={durationError}
        isFormValid={isFormValid}
        onSetCountChange={handleSetCountChange}
        onStrengthSetChange={handleStrengthSetChange}
        onStrengthSetStepChange={handleStrengthSetStepChange}
        onDurationInputChange={setDurationInput}
        onAddExercise={() => saveCurrentExercise('add')}
        onCompleteRoutine={() => saveCurrentExercise('complete')}
      />
      {isTitleDialogOpen && (
        <RoutineTitleView
          form={titleForm}
          titlePlaceholder="저장할 루틴의 제목을 입력해주세요"
          onTitleChange={handleTitleChange}
          onSave={handleDialogSave}
          onCancel={handleDialogCancel}
        />
      )}
    </>
  );
}
