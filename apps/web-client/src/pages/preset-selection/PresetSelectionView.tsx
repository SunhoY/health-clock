interface PresetSelectionViewProps {
  presets: Preset[];
  onPresetSelect: (presetId: string) => void;
  onAddWorkout: () => void;
}

interface Preset {
  id: string;
  title: string;
  exercises: Exercise[];
  createdAt: Date;
  lastUsed?: Date;
}

interface Exercise {
  id: string;
  part: string;
  name: string;
  sets: number;
  weight?: number;
  duration?: number;
}

export const PresetSelectionView = ({ 
  presets, 
  onPresetSelect, 
  onAddWorkout 
}: PresetSelectionViewProps) => {
  if (presets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            운동 루틴 선택
          </h1>
          <div className="bg-gray-800 rounded-lg p-8 max-w-md">
            <div className="text-gray-400 mb-6">
              <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg">저장된 운동 루틴이 없습니다</p>
              <p className="text-sm mt-2">새로운 운동 루틴을 만들어보세요</p>
            </div>
            <button
              onClick={onAddWorkout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              운동 루틴 만들기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          운동 루틴 선택
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {presets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onPresetSelect(preset.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPresetSelect(preset.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${preset.title} 프리셋 선택하기`}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl border border-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {preset.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {preset.exercises.length}개의 운동
              </p>
              <div className="space-y-2">
                {preset.exercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.id} className="flex justify-between text-sm">
                    <span className="text-gray-300">{exercise.name}</span>
                    <span className="text-gray-500">{exercise.sets}세트</span>
                  </div>
                ))}
                {preset.exercises.length > 3 && (
                  <p className="text-gray-500 text-sm">
                    +{preset.exercises.length - 3}개 더...
                  </p>
                )}
              </div>
              {preset.lastUsed && (
                <p className="text-gray-500 text-xs mt-4">
                  마지막 사용: {new Date(preset.lastUsed).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onAddWorkout}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            새로운 루틴 만들기
          </button>
        </div>
      </div>
    </div>
  );
}; 