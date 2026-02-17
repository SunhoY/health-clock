import { useRef, useState } from 'react';
import { Exercise } from '../../types/exercise';

interface ExerciseSelectionViewProps {
  selectedBodyPart: string;
  exercises: Exercise[];
  title?: string;
  emptyMessage?: string;
  isLoading?: boolean;
  loadError?: string | null;
  onRetry?: () => void;
  onExerciseSelect: (exercise: Exercise) => void;
  isEditMode?: boolean;
  onEditExercise?: (exercise: Exercise) => void;
  onDeleteExercise?: (exercise: Exercise) => void;
  onBack?: () => void;
}

export function ExerciseSelectionView({
  selectedBodyPart,
  exercises,
  title,
  emptyMessage,
  isLoading = false,
  loadError = null,
  onRetry,
  onExerciseSelect,
  isEditMode = false,
  onEditExercise,
  onDeleteExercise,
  onBack
}: ExerciseSelectionViewProps) {
  const LONG_PRESS_MS = 700;
  const [openMenuExerciseId, setOpenMenuExerciseId] = useState<string | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredExerciseIdRef = useRef<string | null>(null);

  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const startLongPress = (exerciseId: string) => {
    clearLongPress();
    longPressTriggeredExerciseIdRef.current = null;
    longPressTimerRef.current = setTimeout(() => {
      setOpenMenuExerciseId(exerciseId);
      longPressTriggeredExerciseIdRef.current = exerciseId;
    }, LONG_PRESS_MS);
  };

  const handleCardClick = (exercise: Exercise) => {
    if (isEditMode && longPressTriggeredExerciseIdRef.current === exercise.id) {
      longPressTriggeredExerciseIdRef.current = null;
      return;
    }

    setOpenMenuExerciseId(null);
    onExerciseSelect(exercise);
  };

  const getBodyPartDisplayName = (bodyPart: string): string => {
    const bodyPartNames: { [key: string]: string } = {
      chest: '가슴',
      back: '등',
      legs: '하체',
      shoulders: '어깨',
      arms: '팔',
      abs: '코어(복부)',
      core: '코어(복부)',
      calves: '종아리',
      fullbody: '전신',
      cardio: '유산소'
    };
    return bodyPartNames[bodyPart] || bodyPart;
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 pb-28 pt-8 text-white sm:pb-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold">{title ?? `${getBodyPartDisplayName(selectedBodyPart)} 운동`}</h1>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-10 text-center">
              <p className="text-base text-gray-400">운동 목록을 불러오는 중입니다.</p>
            </div>
          ) : loadError ? (
            <div className="rounded-2xl border border-rose-900 bg-gray-800 px-4 py-10 text-center">
              <p className="text-base text-rose-300">{loadError}</p>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-4 rounded-full bg-gray-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  다시 시도
                </button>
              )}
            </div>
          ) : exercises.length > 0 ? (
            exercises.map((exercise) => (
              <div key={exercise.id} className="relative">
                <button
                  onClick={() => handleCardClick(exercise)}
                  onMouseDown={() => isEditMode && startLongPress(exercise.id)}
                  onMouseUp={clearLongPress}
                  onMouseLeave={clearLongPress}
                  onTouchStart={(event) => {
                    if (!isEditMode) {
                      return;
                    }
                    event.preventDefault();
                    startLongPress(exercise.id);
                  }}
                  onTouchEnd={clearLongPress}
                  onTouchCancel={clearLongPress}
                  onContextMenu={(event) => event.preventDefault()}
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-700 bg-gray-800 px-5 py-5 text-left text-lg font-semibold text-white transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label={`${exercise.name} 선택`}
                >
                  <span className="truncate pr-10">{exercise.name}</span>
                  {!isEditMode && (
                    <span aria-hidden="true" className="text-xl text-gray-400">
                      &gt;
                    </span>
                  )}
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    aria-label={`${exercise.name} 관리 메뉴`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenuExerciseId(exercise.id);
                    }}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-xl font-bold leading-none text-gray-300 transition-colors hover:text-white"
                  >
                    ⋮
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-10 text-center">
              <p className="text-base text-gray-400">
                {emptyMessage ?? '선택된 부위에 해당하는 운동이 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {isEditMode && openMenuExerciseId && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-6"
          onClick={() => setOpenMenuExerciseId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="운동 관리 메뉴"
            className="w-full max-w-xs select-none rounded-2xl border border-gray-700 bg-gray-800 p-3 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  const target = exercises.find((exercise) => exercise.id === openMenuExerciseId);
                  setOpenMenuExerciseId(null);
                  if (target && onEditExercise) {
                    onEditExercise(target);
                  }
                }}
                className="w-full rounded-xl px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-gray-700"
              >
                편집
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = exercises.find((exercise) => exercise.id === openMenuExerciseId);
                  setOpenMenuExerciseId(null);
                  if (target && onDeleteExercise) {
                    onDeleteExercise(target);
                  }
                }}
                className="w-full rounded-xl px-4 py-3 text-center text-lg font-bold text-rose-300 transition-colors hover:bg-gray-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditMode && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="fixed inset-x-6 bottom-[max(1.75rem,calc(env(safe-area-inset-bottom)+0.75rem))] z-20 rounded-full bg-gray-700 py-4 text-lg font-bold text-white transition hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 sm:static sm:mx-auto sm:mt-8 sm:block sm:w-full sm:max-w-md"
        >
          돌아가기
        </button>
      )}
    </div>
  );
}
