interface CreateRoutineViewProps {
  bodyParts: BodyPart[];
  onBodyPartSelect: (bodyPartId: string) => void;
}

interface BodyPart {
  id: string;
  name: string;
}

export const CreateRoutineView = ({ 
  bodyParts, 
  onBodyPartSelect 
}: CreateRoutineViewProps) => {
  return (
    <div className="min-h-screen bg-gray-900 px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">운동 루틴 만들기</h1>
          <p className="mt-2 text-gray-400">운동할 부위를 선택해주세요</p>
        </div>

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
      </div>
    </div>
  );
}; 
