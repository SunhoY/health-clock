import { TimerState, WorkoutViewModel } from '../../types/exercise';

interface WorkoutViewProps {
  viewModel: WorkoutViewModel;
  timerState: TimerState;
  isResting: boolean;
  onCompleteSet: () => void;
  onSkipRest: () => void;
}

export function WorkoutView({
  viewModel,
  timerState,
  isResting,
  onCompleteSet,
  onSkipRest
}: WorkoutViewProps) {
  const metricTexts = [
    viewModel.weight !== undefined ? `${viewModel.weight}kg` : undefined,
    viewModel.reps !== undefined ? `${viewModel.reps}회` : undefined,
    viewModel.duration !== undefined ? `${viewModel.duration}분` : undefined
  ].filter((value): value is string => value !== undefined);

  const nextMetricTexts = [
    viewModel.nextWeight !== undefined ? `${viewModel.nextWeight}kg` : undefined,
    viewModel.nextReps !== undefined ? `${viewModel.nextReps}회` : undefined,
    viewModel.nextDuration !== undefined ? `${viewModel.nextDuration}분` : undefined
  ].filter((value): value is string => value !== undefined);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col">
        <header className="mb-10 text-center">
          <p className="text-sm text-slate-400">
            운동 {viewModel.currentExerciseIndex + 1} / {viewModel.totalExercises}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${viewModel.percentComplete}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-slate-300">{Math.round(viewModel.percentComplete)}% 완료</p>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {viewModel.exerciseName}
          </h1>
          <p className="mt-4 text-2xl font-medium text-slate-200 sm:text-3xl">
            {viewModel.currentSet} / {viewModel.totalSets} 세트
          </p>
          {metricTexts.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {metricTexts.map(text => (
                <span
                  key={text}
                  className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-base font-medium text-slate-100"
                >
                  {text}
                </span>
              ))}
            </div>
          )}
          {isResting && (
            <div className="mt-8">
              <p className="text-base text-slate-300">휴식 시간</p>
              <p className="mt-2 text-5xl font-bold tabular-nums sm:text-6xl">
                {formatTime(timerState.timeRemaining)}
              </p>
              {viewModel.nextSetLabel && (
                <p className="mt-6 text-lg font-semibold text-slate-100">{viewModel.nextSetLabel}</p>
              )}
              {nextMetricTexts.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {nextMetricTexts.map(text => (
                    <span
                      key={`next-${text}`}
                      className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-base font-medium text-slate-100"
                    >
                      {text}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="pb-2">
          {isResting ? (
            <button
              onClick={onSkipRest}
              className="w-full rounded-2xl bg-slate-100 px-6 py-5 text-lg font-semibold text-slate-900 transition-colors hover:bg-slate-200"
            >
              바로 다음 세트
            </button>
          ) : (
            <button
              onClick={onCompleteSet}
              className="w-full rounded-2xl bg-cyan-400 px-6 py-5 text-xl font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
            >
              세트 완료
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
