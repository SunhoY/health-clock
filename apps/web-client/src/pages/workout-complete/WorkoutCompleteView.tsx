import { CelebrationMessage, WorkoutCompletionData, Achievement } from '../../types/exercise';

interface WorkoutCompleteViewProps {
  completionData: WorkoutCompletionData;
  celebrationMessage: CelebrationMessage;
  achievements?: Achievement[];
  onViewSummary: () => void;
  onStartNewWorkout: () => void;
  onGoHome: () => void;
}

export const WorkoutCompleteView = ({
  completionData,
  celebrationMessage,
  achievements = [],
  onViewSummary,
  onStartNewWorkout,
  onGoHome,
}: WorkoutCompleteViewProps) => {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto space-y-8">
        {/* 축하 메시지 섹션 */}
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">
            {celebrationMessage.emoji}
          </div>
          <h1 className="text-2xl font-bold text-green-400">
            {celebrationMessage.message}
          </h1>
        </div>

        {/* 운동 요약 섹션 */}
        <div className="bg-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-center text-blue-400">
            오늘의 운동 요약
          </h2>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-400">운동 시간</div>
              <div className="text-xl font-bold text-white">
                {formatDuration(completionData.duration)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">총 세트</div>
              <div className="text-xl font-bold text-white">
                {completionData.totalSets}세트
              </div>
            </div>
            {completionData.totalWeight && completionData.totalWeight > 0 && (
              <div className="text-center">
                <div className="text-gray-400">총 중량</div>
                <div className="text-xl font-bold text-white">
                  {formatWeight(completionData.totalWeight)}
                </div>
              </div>
            )}
            {completionData.caloriesBurned && (
              <div className="text-center">
                <div className="text-gray-400">소모 칼로리</div>
                <div className="text-xl font-bold text-white">
                  {completionData.caloriesBurned}kcal
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold mb-3 text-green-400">
              완료한 운동
            </h3>
            <div className="space-y-2">
              {completionData.exercises.map((exercise, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 rounded px-3 py-2">
                  <span className="text-white">{exercise.exerciseName}</span>
                  <span className="text-gray-300 text-sm">
                    {exercise.sets.length}세트
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 성취 배지 섹션 */}
        {achievements.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-center text-yellow-400 mb-4">
              🏆 새로운 성취!
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 bg-gray-700 rounded p-3">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{achievement.title}</div>
                    <div className="text-sm text-gray-300">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 액션 버튼 섹션 */}
        <div className="space-y-4">
          <button
            onClick={onViewSummary}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            상세 요약 보기
          </button>
          
          <button
            onClick={onStartNewWorkout}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            추가 운동하기
          </button>
          
          <button
            onClick={onGoHome}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}; 