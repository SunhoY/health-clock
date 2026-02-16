import { WorkoutProgress, TimerState } from '../../types/exercise';

interface WorkoutViewProps {
  progress: WorkoutProgress;
  timerState: TimerState;
  isResting: boolean;
  onCompleteSet: () => void;
  onSkipRest: () => void;
}

export function WorkoutView({
  progress,
  timerState,
  isResting,
  onCompleteSet,
  onSkipRest
}: WorkoutViewProps) {
  const { currentExercise, currentSet, totalSets, percentComplete } = progress;

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
            운동 {progress.currentExerciseIndex + 1} / {progress.totalExercises}
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-slate-300">{Math.round(percentComplete)}% 완료</p>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {currentExercise.exerciseName}
          </h1>
          <p className="mt-4 text-2xl font-medium text-slate-200 sm:text-3xl">
            {currentSet} / {totalSets} 세트
          </p>
          {isResting && (
            <div className="mt-8">
              <p className="text-base text-slate-300">휴식 시간</p>
              <p className="mt-2 text-5xl font-bold tabular-nums sm:text-6xl">
                {formatTime(timerState.timeRemaining)}
              </p>
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
