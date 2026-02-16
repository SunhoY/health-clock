import { Exercise, FormConfig } from '../../types/exercise';

interface StrengthSetInput {
  setNumber: number;
  weightInput: string;
  repsInput: string;
}

interface ExerciseDetailViewProps {
  exercise: Exercise;
  isCardio: boolean;
  setCount: number;
  setRange: FormConfig['sets'];
  strengthSets: StrengthSetInput[];
  strengthErrors: Record<number, { weight?: string; reps?: string }>;
  durationInput: string;
  durationError?: string;
  isFormValid: boolean;
  onSetCountChange: (sets: number) => void;
  onStrengthSetChange: (setNumber: number, field: 'weightInput' | 'repsInput', value: string) => void;
  onDurationInputChange: (value: string) => void;
  onAddExercise: () => void;
  onCompleteRoutine: () => void;
}

export function ExerciseDetailView({
  exercise,
  isCardio,
  setCount,
  setRange,
  strengthSets,
  strengthErrors,
  durationInput,
  durationError,
  isFormValid,
  onSetCountChange,
  onStrengthSetChange,
  onDurationInputChange,
  onAddExercise,
  onCompleteRoutine
}: ExerciseDetailViewProps) {
  const canDecreaseSets = setCount > setRange.min;
  const canIncreaseSets = setCount < setRange.max;

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold">{exercise.name}</h1>
        </div>

        <div className="flex-1 space-y-4 pb-32">
          {!isCardio && (
            <section className="rounded-2xl border border-gray-700 bg-gray-800 p-4">
              <p className="mb-3 text-sm text-gray-400">세트 수</p>
              <div className="flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3">
                <button
                  type="button"
                  aria-label="세트 수 감소"
                  disabled={!canDecreaseSets}
                  onClick={() => onSetCountChange(setCount - 1)}
                  className="h-10 w-10 rounded-full bg-gray-700 text-xl font-bold text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
                >
                  -
                </button>
                <p className="text-xl font-semibold">{setCount}세트</p>
                <button
                  type="button"
                  aria-label="세트 수 증가"
                  disabled={!canIncreaseSets}
                  onClick={() => onSetCountChange(setCount + 1)}
                  className="h-10 w-10 rounded-full bg-gray-700 text-xl font-bold text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
                >
                  +
                </button>
              </div>
            </section>
          )}

          {!isCardio &&
            strengthSets.map((set) => {
              const error = strengthErrors[set.setNumber];

              return (
                <section
                  key={set.setNumber}
                  className="rounded-2xl border border-gray-700 bg-gray-800 p-4"
                  data-testid={`strength-set-row-${set.setNumber}`}
                >
                  <p className="mb-3 text-base font-semibold text-white">{set.setNumber}세트</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`weight-input-${set.setNumber}`} className="mb-2 block text-xs text-gray-400">
                        중량(kg)
                      </label>
                      <input
                        id={`weight-input-${set.setNumber}`}
                        inputMode="numeric"
                        value={set.weightInput}
                        onChange={(event) =>
                          onStrengthSetChange(set.setNumber, 'weightInput', event.target.value)
                        }
                        className="w-full rounded-xl border border-gray-600 bg-gray-900 px-3 py-3 text-lg font-semibold text-white outline-none focus:border-cyan-400"
                        placeholder="0"
                      />
                      {error?.weight && <p className="mt-2 text-xs text-rose-400">{error.weight}</p>}
                    </div>
                    <div>
                      <label htmlFor={`reps-input-${set.setNumber}`} className="mb-2 block text-xs text-gray-400">
                        횟수(reps)
                      </label>
                      <input
                        id={`reps-input-${set.setNumber}`}
                        inputMode="numeric"
                        value={set.repsInput}
                        onChange={(event) => onStrengthSetChange(set.setNumber, 'repsInput', event.target.value)}
                        className="w-full rounded-xl border border-gray-600 bg-gray-900 px-3 py-3 text-lg font-semibold text-white outline-none focus:border-cyan-400"
                        placeholder="0"
                      />
                      {error?.reps && <p className="mt-2 text-xs text-rose-400">{error.reps}</p>}
                    </div>
                  </div>
                </section>
              );
            })}

          {isCardio && (
            <section className="rounded-2xl border border-gray-700 bg-gray-800 p-4">
              <label htmlFor="duration-input" className="mb-2 block text-sm text-gray-400">
                시간(분)
              </label>
              <input
                id="duration-input"
                inputMode="numeric"
                value={durationInput}
                onChange={(event) => {
                  const next = event.target.value;
                  if (/^\d*$/.test(next)) {
                    onDurationInputChange(next);
                  }
                }}
                className="w-full rounded-xl border border-gray-600 bg-gray-900 px-3 py-3 text-2xl font-bold text-white outline-none focus:border-cyan-400"
                placeholder="0"
              />
              {durationError && <p className="mt-2 text-xs text-rose-400">{durationError}</p>}
            </section>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-800 bg-gray-900/95 backdrop-blur">
          <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3 px-6 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-3">
            <button
              type="button"
              onClick={onAddExercise}
              disabled={!isFormValid}
              className="rounded-xl border border-gray-600 bg-gray-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:border-gray-800 disabled:bg-gray-900 disabled:text-gray-600"
            >
              운동 더 추가
            </button>
            <button
              type="button"
              onClick={onCompleteRoutine}
              disabled={!isFormValid}
              className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
