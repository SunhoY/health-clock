import { Exercise } from '../../types/exercise';

interface ExerciseSelectionViewProps {
  selectedBodyPart: string;
  exercises: Exercise[];
  title?: string;
  emptyMessage?: string;
  onExerciseSelect: (exercise: Exercise) => void;
}

export function ExerciseSelectionView({ 
  selectedBodyPart, 
  exercises, 
  title,
  emptyMessage,
  onExerciseSelect 
}: ExerciseSelectionViewProps) {
  const getBodyPartDisplayName = (bodyPart: string): string => {
    const bodyPartNames: { [key: string]: string } = {
      chest: '가슴',
      back: '등',
      legs: '하체',
      shoulders: '어깨',
      arms: '팔',
      abs: '코어(복부)',
      core: '코어(복부)',
      calves: '종아리',
      fullbody: '전신',
      cardio: '유산소'
    };
    return bodyPartNames[bodyPart] || bodyPart;
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-8 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold">{title ?? `${getBodyPartDisplayName(selectedBodyPart)} 운동`}</h1>
        </div>

        <div className="space-y-3">
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => onExerciseSelect(exercise)}
                className="flex w-full items-center justify-between rounded-2xl border border-gray-700 bg-gray-800 px-5 py-5 text-left text-lg font-semibold text-white transition-colors duration-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                aria-label={`${exercise.name} 선택`}
              >
                <span>{exercise.name}</span>
                <span aria-hidden="true" className="text-xl text-gray-400">
                  &gt;
                </span>
              </button>
            ))
          ) : (
            <div className="rounded-2xl border border-gray-700 bg-gray-800 px-4 py-10 text-center">
              <p className="text-base text-gray-400">
                {emptyMessage ?? '선택된 부위에 해당하는 운동이 없습니다.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
