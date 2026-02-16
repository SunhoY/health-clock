import { WorkoutDetailSummaryViewModel } from '../../types/exercise';

interface WorkoutSummaryViewProps {
  viewModel: WorkoutDetailSummaryViewModel;
  onGoHome: () => void;
}

const bodyPartLabelMap: Record<string, string> = {
  cardio: '유산소',
  upper: '상체',
  lower: '하체',
  core: '코어',
};

export const WorkoutSummaryView = ({
  viewModel,
  onGoHome,
}: WorkoutSummaryViewProps) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-32">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-emerald-300">운동 상세 요약</h1>
        </div>

        <section className="bg-gray-800 rounded-2xl p-6" data-testid="today-body-parts">
          <h2 className="text-sm text-gray-400 mb-3">오늘 운동 부위</h2>
          <div className="flex flex-wrap gap-2">
            {viewModel.todayBodyParts.map((bodyPart) => (
              <span
                key={bodyPart}
                className="rounded-full bg-gray-700 px-3 py-1.5 text-sm font-medium"
              >
                {bodyPartLabelMap[bodyPart]}
              </span>
            ))}
          </div>
        </section>

        <div className="mt-4 space-y-4">
          {viewModel.sections.map((section) => (
            <section
              key={section.bodyPart}
              data-testid={`section-${section.bodyPart}`}
              className="rounded-2xl bg-gray-800 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{section.label}</h3>

              {section.bodyPart === 'cardio' ? (
                <div className="mt-3">
                  <p className="text-sm text-gray-400">소모한 칼로리</p>
                  <p className="text-2xl font-bold text-white">{section.caloriesBurned ?? 0}kcal</p>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">총 세트수</p>
                    <p className="text-2xl font-bold text-white">{section.totalSets ?? 0}세트</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">최대 중량</p>
                    <p className="text-2xl font-bold text-white">{section.maxWeight ?? 0}kg</p>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-800 bg-gray-900/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-6 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
          <button
            onClick={onGoHome}
            className="w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-slate-950 transition-colors hover:bg-emerald-600"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};
