interface CreateRoutineViewProps {
  bodyParts: BodyPart[];
  onBodyPartSelect: (bodyPartId: string) => void;
  isLoading?: boolean;
  loadError?: string | null;
  onRetry?: () => void;
}

interface BodyPart {
  id: string;
  name: string;
}

export const CreateRoutineView = ({
  bodyParts,
  onBodyPartSelect,
  isLoading = false,
  loadError = null,
  onRetry
}: CreateRoutineViewProps) => {
  return (
    <div className="min-h-screen bg-gray-900 px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">운동 루틴 만들기</h1>
          <p className="mt-2 text-gray-400">운동할 부위를 선택해주세요</p>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-10 text-center">
            <p className="text-base text-gray-300">운동 부위를 불러오는 중입니다.</p>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-8 text-center">
            <p className="text-base text-red-300">{loadError}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 rounded-xl bg-gray-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-gray-600"
            >
              다시 시도
            </button>
          </div>
        ) : bodyParts.length === 0 ? (
          <div className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-10 text-center">
            <p className="text-base text-gray-300">표시할 운동 부위가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {bodyParts.map((bodyPart) => (
              <button
                key={bodyPart.id}
                onClick={() => onBodyPartSelect(bodyPart.id)}
                className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-5 text-center text-lg font-semibold text-white transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`${bodyPart.name} 부위 선택하기`}
              >
                {bodyPart.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
