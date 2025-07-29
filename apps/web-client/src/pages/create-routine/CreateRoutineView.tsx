interface CreateRoutineViewProps {
  bodyParts: BodyPart[];
  onBodyPartSelect: (bodyPartId: string) => void;
}

interface BodyPart {
  id: string;
  name: string;
  icon?: string;
  exercises: string[];
}

export const CreateRoutineView = ({ 
  bodyParts, 
  onBodyPartSelect 
}: CreateRoutineViewProps) => {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">운동 루틴 만들기</h1>
          <p className="text-gray-400">운동할 부위를 선택해주세요</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {bodyParts.map((bodyPart) => (
            <button
              key={bodyPart.id}
              onClick={() => onBodyPartSelect(bodyPart.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onBodyPartSelect(bodyPart.id);
                }
              }}
              className="bg-gray-800 rounded-lg p-6 text-left hover:bg-gray-700 transition-colors duration-200 shadow-lg hover:shadow-xl border border-gray-700 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 group"
              aria-label={`${bodyPart.name} 부위 선택하기`}
              tabIndex={0}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {bodyPart.name}
                </h3>
                {bodyPart.icon && (
                  <span className="text-2xl text-gray-400 group-hover:text-blue-400 transition-colors">
                    {bodyPart.icon}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 mb-2">
                {bodyPart.exercises.length}개의 운동
              </p>
              <div className="space-y-1">
                {bodyPart.exercises.slice(0, 2).map((exercise, index) => (
                  <p key={index} className="text-xs text-gray-500">
                    • {exercise}
                  </p>
                ))}
                {bodyPart.exercises.length > 2 && (
                  <p className="text-xs text-gray-500">
                    +{bodyPart.exercises.length - 2}개 더...
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 