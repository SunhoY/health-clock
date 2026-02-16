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
      <div className="min-h-screen bg-gray-900 px-6 pb-28 pt-16 text-white sm:px-10 sm:pb-16">
        <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center justify-center text-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">운동 루틴 선택</h1>
            <p className="text-gray-400">저장된 루틴이 없습니다.</p>
          </div>
        </div>
        <button
          onClick={onAddWorkout}
          className="fixed inset-x-6 bottom-[max(1.75rem,calc(env(safe-area-inset-bottom)+0.75rem))] z-10 rounded-full bg-cyan-400 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 sm:static sm:mx-auto sm:mt-8 sm:block sm:w-full sm:max-w-2xl"
        >
          루틴 만들기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-6 pb-28 pt-16 text-white sm:px-10 sm:pb-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="mb-8 text-center text-3xl font-bold">운동 루틴 선택</h1>

        <div className="space-y-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset.id)}
              aria-label={`${preset.title} 선택`}
              className="flex w-full items-center justify-between rounded-xl border border-gray-700 bg-gray-800 px-5 py-4 text-left transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">{preset.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{preset.exercises.length}개 운동</p>
              </div>
              <span className="text-xl text-gray-500" aria-hidden="true">
                ›
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onAddWorkout}
        className="fixed inset-x-6 bottom-[max(1.75rem,calc(env(safe-area-inset-bottom)+0.75rem))] z-10 rounded-full bg-cyan-400 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 sm:static sm:mx-auto sm:mt-8 sm:block sm:w-full sm:max-w-2xl"
      >
        루틴 만들기
      </button>
    </div>
  );
};
