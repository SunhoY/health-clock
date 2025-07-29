import { Exercise } from '../../types/exercise';

interface ExerciseSelectionViewProps {
  selectedBodyPart: string;
  exercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
}

export function ExerciseSelectionView({ 
  selectedBodyPart, 
  exercises, 
  onExerciseSelect 
}: ExerciseSelectionViewProps) {
  const getBodyPartDisplayName = (bodyPart: string): string => {
    const bodyPartNames: { [key: string]: string } = {
      chest: '가슴',
      back: '등',
      legs: '하체',
      shoulders: '어깨',
      arms: '팔',
      abs: '복근',
      calves: '종아리',
      fullbody: '전신',
      cardio: '유산소'
    };
    return bodyPartNames[bodyPart] || bodyPart;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {getBodyPartDisplayName(selectedBodyPart)} 운동 선택
          </h1>
          <p className="text-gray-400 text-lg">
            원하는 운동을 선택해주세요
          </p>
        </div>

        {/* 운동 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => onExerciseSelect(exercise)}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-6 text-left transition-all duration-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label={`${exercise.name} 선택`}
              >
                <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-400 mb-1">필요 장비:</p>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 text-xs px-2 py-1 rounded"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {exercise.difficulty && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400 mr-2">난이도:</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      exercise.difficulty === 'beginner' ? 'bg-green-600' :
                      exercise.difficulty === 'intermediate' ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}>
                      {exercise.difficulty === 'beginner' ? '초급' :
                       exercise.difficulty === 'intermediate' ? '중급' : '고급'}
                    </span>
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
                선택된 부위에 해당하는 운동이 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 