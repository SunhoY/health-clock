import { DailyWorkoutSummary, ExerciseSummary } from '../../types/exercise';

interface WorkoutSummaryViewProps {
  summary: DailyWorkoutSummary;
  onGoBack: () => void;
  onGoHome: () => void;
}

export const WorkoutSummaryView = ({
  summary,
  onGoBack,
  onGoHome,
}: WorkoutSummaryViewProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const formatWeight = (weight?: number) => {
    if (!weight) return '0kg';
    return `${weight}kg`;
  };

  const formatExerciseDisplay = (exercise: ExerciseSummary) => {
    if (exercise.type === 'cardio') {
      return `유산소 - ${exercise.exerciseName} - ${exercise.totalDuration}분`;
    } else {
      return `${exercise.bodyPart} - ${exercise.exerciseName} - ${exercise.totalSets}세트`;
    }
  };

  const weightExercises = summary.exercises.filter(ex => ex.type === 'weight');
  const cardioExercises = summary.exercises.filter(ex => ex.type === 'cardio');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-400">
              오늘의 운동 요약
            </h1>
            <p className="text-gray-400 mt-1">
              {formatDate(summary.date)}
            </p>
          </div>
          <div className="space-x-3">
            <button
              onClick={onGoBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              뒤로가기
            </button>
            <button
              onClick={onGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              홈으로
            </button>
          </div>
        </div>

        {/* 전체 통계 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-center text-green-400 mb-6">
            📊 오늘의 통계
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {summary.totalSessions}
              </div>
              <div className="text-sm text-gray-400">운동 세션</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {formatDuration(summary.totalDuration)}
              </div>
              <div className="text-sm text-gray-400">총 운동 시간</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {summary.totalExercises}
              </div>
              <div className="text-sm text-gray-400">운동 종류</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {summary.totalSets}
              </div>
              <div className="text-sm text-gray-400">총 세트</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {summary.totalWeight && summary.totalWeight > 0 && (
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {formatWeight(summary.totalWeight)}
                </div>
                <div className="text-sm text-gray-400">총 중량</div>
              </div>
            )}
            {summary.totalCardioTime && summary.totalCardioTime > 0 && (
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {formatDuration(summary.totalCardioTime)}
                </div>
                <div className="text-sm text-gray-400">유산소 시간</div>
              </div>
            )}
            {summary.estimatedCalories && (
              <div className="text-center">
                <div className="text-xl font-bold text-white">
                  {summary.estimatedCalories}kcal
                </div>
                <div className="text-sm text-gray-400">추정 소모 칼로리</div>
              </div>
            )}
          </div>
        </div>

        {/* 운동 목록 */}
        <div className="space-y-6">
          {/* 웨이트 운동 */}
          {weightExercises.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-4">
                💪 웨이트 운동
              </h3>
              <div className="space-y-3">
                {weightExercises.map((exercise, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-700 rounded px-4 py-3">
                    <div>
                      <div className="font-semibold text-white">
                        {formatExerciseDisplay(exercise)}
                      </div>
                      {exercise.totalWeight && exercise.totalWeight > 0 && (
                        <div className="text-sm text-gray-300">
                          총 중량: {formatWeight(exercise.totalWeight)}
                          {exercise.avgWeight && (
                            <span className="ml-2">
                              (평균: {formatWeight(exercise.avgWeight)})
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {exercise.sessions.length}회 세션
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 유산소 운동 */}
          {cardioExercises.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">
                ❤️ 유산소 운동
              </h3>
              <div className="space-y-3">
                {cardioExercises.map((exercise, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-700 rounded px-4 py-3">
                    <div>
                      <div className="font-semibold text-white">
                        {formatExerciseDisplay(exercise)}
                      </div>
                      {exercise.totalDuration && exercise.totalDuration > 0 && (
                        <div className="text-sm text-gray-300">
                          총 시간: {formatDuration(exercise.totalDuration)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {exercise.sessions.length}회 세션
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 빈 상태 */}
          {summary.exercises.length === 0 && (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🏃‍♂️</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                오늘은 운동 기록이 없어요
              </h3>
              <p className="text-gray-500">
                운동을 시작하고 기록을 남겨보세요!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 