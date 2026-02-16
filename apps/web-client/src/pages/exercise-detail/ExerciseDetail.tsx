import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExerciseDetailView } from './ExerciseDetailView';
import { EXERCISES_DATA, FORM_CONFIG, Exercise, ExerciseDetail as ExerciseDetailModel } from '../../types/exercise';
import { appendTempRoutineData } from '../routine-title/RoutineTitle';

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

  const trimmed = value.replace(/^0+/, '');
  return trimmed === '' ? undefined : trimmed;
};

const parsePositiveInt = (value?: string): number | undefined => {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
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
      const weight = parsePositiveInt(set.weightInput);
      const reps = parsePositiveInt(set.repsInput);

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
      const currentValue = parsePositiveInt(inputValue) ?? 0;
      const nextValue = Math.max(0, currentValue + delta);
      const normalized = nextValue > 0 ? String(nextValue) : undefined;

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
      weight: parsePositiveInt(set.weightInput),
      reps: parsePositiveInt(set.repsInput)
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

  const saveCurrentExercise = (mode: 'add' | 'complete') => {
    const detail = buildExerciseDetail();
    if (!detail) {
      return;
    }

    appendTempRoutineData(detail);
    console.log(mode === 'add' ? '운동 추가:' : '루틴 완료:', detail);

    if (mode === 'add') {
      navigate(`/exercise-selection/${bodyPart ?? detail.bodyPart}`);
      return;
    }

    navigate('/routine-title');
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
  );
}
