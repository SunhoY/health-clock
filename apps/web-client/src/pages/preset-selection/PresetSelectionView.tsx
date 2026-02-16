import { useEffect, useRef, useState } from 'react';

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
  const LONG_PRESS_DELAY_MS = 300;
  const LONG_PRESS_FILL_MS = 500;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [openMenuPresetId, setOpenMenuPresetId] = useState<string | null>(null);
  const [longPressActivePresetId, setLongPressActivePresetId] = useState<string | null>(null);
  const longPressDelayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressCompleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggeredPresetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const blockContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    root.addEventListener('contextmenu', blockContextMenu);
    return () => {
      root.removeEventListener('contextmenu', blockContextMenu);
    };
  }, []);

  const startLongPress = (presetId: string) => {
    if (longPressDelayTimerRef.current) {
      clearTimeout(longPressDelayTimerRef.current);
    }
    if (longPressCompleteTimerRef.current) {
      clearTimeout(longPressCompleteTimerRef.current);
    }

    setLongPressActivePresetId(null);
    longPressTriggeredPresetIdRef.current = null;

    longPressDelayTimerRef.current = setTimeout(() => {
      setLongPressActivePresetId(presetId);
      longPressCompleteTimerRef.current = setTimeout(() => {
        setLongPressActivePresetId(null);
        setOpenMenuPresetId(presetId);
        longPressTriggeredPresetIdRef.current = presetId;
      }, LONG_PRESS_FILL_MS);
    }, LONG_PRESS_DELAY_MS);
  };

  const clearLongPress = () => {
    setLongPressActivePresetId(null);
    if (longPressDelayTimerRef.current) {
      clearTimeout(longPressDelayTimerRef.current);
      longPressDelayTimerRef.current = null;
    }
    if (longPressCompleteTimerRef.current) {
      clearTimeout(longPressCompleteTimerRef.current);
      longPressCompleteTimerRef.current = null;
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

  const openActionDialog = (presetId: string) => {
    setOpenMenuPresetId(presetId);
  };

  const closeActionDialog = () => {
    setOpenMenuPresetId(null);
  };

  const handleEditClick = (presetId: string) => {
    closeActionDialog();
    onEditPreset(presetId);
  };

  const handleDeleteClick = (presetId: string) => {
    closeActionDialog();
    onDeletePreset(presetId);
  };

  if (presets.length === 0) {
    return (
      <div ref={rootRef} className="min-h-screen bg-gray-900 px-6 pb-28 pt-16 text-white sm:px-10 sm:pb-16">
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
    <div ref={rootRef} className="min-h-screen bg-gray-900 px-6 pb-28 pt-16 text-white sm:px-10 sm:pb-16">
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
                onTouchStart={(event) => {
                  event.preventDefault();
                  startLongPress(preset.id);
                }}
                onTouchEnd={clearLongPress}
                onTouchCancel={clearLongPress}
                onContextMenu={(event) => event.preventDefault()}
                aria-label={`${preset.title} 선택`}
                className="relative flex w-full select-none items-center justify-between overflow-hidden rounded-xl border border-gray-700 bg-gray-800 px-5 py-4 pr-16 text-left transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-300 [-webkit-touch-callout:none]"
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-y-0 left-0 bg-cyan-400/20 ${
                    longPressActivePresetId === preset.id
                      ? 'w-full transition-all duration-[500ms] ease-linear'
                      : 'w-0 transition-none'
                  }`}
                />
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
                  openActionDialog(preset.id);
                }}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-xl font-bold leading-none text-gray-300 transition-colors hover:text-white"
              >
                ⋮
              </button>
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

      {openMenuPresetId && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-6"
          onClick={closeActionDialog}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="루틴 관리 메뉴"
            className="w-full max-w-xs select-none rounded-2xl border border-gray-700 bg-gray-800 p-3 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleEditClick(openMenuPresetId)}
                className="w-full rounded-xl px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-gray-700"
              >
                편집
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(openMenuPresetId)}
                className="w-full rounded-xl px-4 py-3 text-center text-lg font-bold text-rose-300 transition-colors hover:bg-gray-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
