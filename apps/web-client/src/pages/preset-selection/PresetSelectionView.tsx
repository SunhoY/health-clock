import { useRef, useState } from 'react';

interface PresetSelectionViewProps {
  presets: Preset[];
  onPresetSelect: (presetId: string) => void;
  onAddWorkout: () => void;
  onEditPreset: (presetId: string) => void;
  onDeletePreset: (presetId: string) => void;
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
  onAddWorkout,
  onEditPreset,
  onDeletePreset
}: PresetSelectionViewProps) => {
  const [openMenuPresetId, setOpenMenuPresetId] = useState<string | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredPresetIdRef = useRef<string | null>(null);

  const startLongPress = (presetId: string) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }

    longPressTriggeredPresetIdRef.current = null;
    longPressTimerRef.current = setTimeout(() => {
      setOpenMenuPresetId(presetId);
      longPressTriggeredPresetIdRef.current = presetId;
    }, 500);
  };

  const clearLongPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleCardClick = (presetId: string) => {
    if (longPressTriggeredPresetIdRef.current === presetId) {
      longPressTriggeredPresetIdRef.current = null;
      return;
    }

    setOpenMenuPresetId(null);
    onPresetSelect(presetId);
  };

  const handleMenuToggle = (presetId: string) => {
    setOpenMenuPresetId((prev) => (prev === presetId ? null : presetId));
  };

  const handleEditClick = (presetId: string) => {
    setOpenMenuPresetId(null);
    onEditPreset(presetId);
  };

  const handleDeleteClick = (presetId: string) => {
    setOpenMenuPresetId(null);
    onDeletePreset(presetId);
  };

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
            <div key={preset.id} className="relative">
              <button
                onClick={() => handleCardClick(preset.id)}
                onMouseDown={() => startLongPress(preset.id)}
                onMouseUp={clearLongPress}
                onMouseLeave={clearLongPress}
                onTouchStart={() => startLongPress(preset.id)}
                onTouchEnd={clearLongPress}
                onTouchCancel={clearLongPress}
                aria-label={`${preset.title} 선택`}
                className="flex w-full items-center justify-between rounded-xl border border-gray-700 bg-gray-800 px-5 py-4 pr-16 text-left transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">{preset.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">{preset.exercises.length}개 운동</p>
                </div>
              </button>
              <button
                type="button"
                aria-label={`${preset.title} 관리 메뉴`}
                onClick={(event) => {
                  event.stopPropagation();
                  handleMenuToggle(preset.id);
                }}
                className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-lg border border-gray-600 bg-gray-700 text-xl font-bold text-gray-200 transition-colors hover:bg-gray-600"
              >
                ≡
              </button>

              {openMenuPresetId === preset.id && (
                <div className="absolute right-3 top-[calc(100%+0.35rem)] z-20 min-w-[120px] rounded-lg border border-gray-700 bg-gray-800 p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => handleEditClick(preset.id)}
                    className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-white transition-colors hover:bg-gray-700"
                  >
                    편집
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(preset.id)}
                    className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-rose-300 transition-colors hover:bg-gray-700"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
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
