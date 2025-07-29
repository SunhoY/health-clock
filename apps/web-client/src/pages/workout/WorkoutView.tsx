import { WorkoutProgress, TimerState } from '../../types/exercise';

interface WorkoutViewProps {
  progress: WorkoutProgress;
  timerState: TimerState;
  isResting: boolean;
  onCompleteSet: () => void;
  onSkipRest: () => void;
  onPauseWorkout: () => void;
  onResumeWorkout: () => void;
  onAbandonWorkout: () => void;
}

export function WorkoutView({
  progress,
  timerState,
  isResting,
  onCompleteSet,
  onSkipRest,
  onPauseWorkout,
  onResumeWorkout,
  onAbandonWorkout
}: WorkoutViewProps) {
  const { currentExercise, currentSet, totalSets, percentComplete } = progress;
  const isCardio = currentExercise.bodyPart === 'cardio';

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">운동 진행</h1>
          <div className="flex gap-2">
            {timerState.isPaused ? (
              <button
                onClick={onResumeWorkout}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                재개
              </button>
            ) : (
              <button
                onClick={onPauseWorkout}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
              >
                일시정지
              </button>
            )}
            <button
              onClick={onAbandonWorkout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              중단
            </button>
          </div>
        </div>

        {/* 진행률 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">진행률</span>
            <span className="text-sm font-semibold">{Math.round(percentComplete)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        {/* 운동 정보 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{currentExercise.exerciseName}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">운동 부위:</span>
              <span className="ml-2">{currentExercise.bodyPart}</span>
            </div>
            <div>
              <span className="text-gray-400">세트:</span>
              <span className="ml-2">{currentSet} / {totalSets}</span>
            </div>
            {!isCardio && currentExercise.weight && (
              <div>
                <span className="text-gray-400">중량:</span>
                <span className="ml-2">{currentExercise.weight}kg</span>
              </div>
            )}
            {isCardio && currentExercise.duration && (
              <div>
                <span className="text-gray-400">시간:</span>
                <span className="ml-2">{currentExercise.duration}분</span>
              </div>
            )}
          </div>
        </div>

        {/* 휴식 타이머 또는 세트 완료 버튼 */}
        {isResting ? (
          <div className="bg-blue-900 rounded-lg p-6 mb-6 text-center">
            <h3 className="text-lg font-semibold mb-4">휴식 시간</h3>
            <div className="text-4xl font-bold mb-4">
              {formatTime(timerState.timeRemaining)}
            </div>
            <button
              onClick={onSkipRest}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              휴식 건너뛰기
            </button>
          </div>
        ) : (
          <div className="bg-green-900 rounded-lg p-6 mb-6 text-center">
            <h3 className="text-lg font-semibold mb-4">세트 {currentSet} 진행 중</h3>
            <p className="text-gray-300 mb-4">
              {isCardio ? '운동을 진행하세요' : '운동을 완료한 후 버튼을 눌러주세요'}
            </p>
            <button
              onClick={onCompleteSet}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold transition-colors"
            >
              세트 완료
            </button>
          </div>
        )}

        {/* 다음 운동 정보 */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">다음 운동</h3>
          <p className="text-gray-300">
            {currentSet < totalSets 
              ? `${currentExercise.exerciseName} - 세트 ${currentSet + 1}`
              : '모든 운동 완료!'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 