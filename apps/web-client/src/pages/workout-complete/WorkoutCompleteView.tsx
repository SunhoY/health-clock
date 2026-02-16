import { WorkoutCompletionData } from '../../types/exercise';

interface WorkoutCompleteViewProps {
  completionData: WorkoutCompletionData;
  onViewSummary: () => void;
  onFinishWorkout: () => void;
}

export const WorkoutCompleteView = ({
  completionData,
  onViewSummary,
  onFinishWorkout,
}: WorkoutCompleteViewProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-md mx-auto flex min-h-[calc(100vh-4rem)] flex-col">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-300">운동 끝!</h1>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 space-y-6">
          <section className="text-center" data-testid="workout-duration">
            <p className="text-sm text-gray-400">운동 시간</p>
            <p className="mt-1 text-2xl font-semibold text-white">{formatDuration(completionData.duration)}</p>
          </section>

          <section data-testid="completed-exercises">
            <p className="text-sm text-gray-400 mb-3">완료한 운동</p>
            <ul className="space-y-2">
              {completionData.exercises.map((exercise) => (
                <li
                  key={`${exercise.exerciseId}-${exercise.exerciseName}`}
                  className="rounded-lg bg-gray-700 px-4 py-3 text-white"
                >
                  {exercise.exerciseName}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-auto space-y-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-6">
          <button
            onClick={onFinishWorkout}
            className="w-full rounded-2xl bg-emerald-400 px-6 py-4 text-lg font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
          >
            운동 마치기
          </button>

          <button
            onClick={onViewSummary}
            className="w-full rounded-2xl bg-slate-100 px-6 py-4 text-lg font-semibold text-slate-900 transition-colors hover:bg-slate-200"
          >
            상세 요약 보기
          </button>
        </div>
      </div>
    </div>
  );
};
