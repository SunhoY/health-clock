import { Exercise, FormState, FormConfig } from '../../types/exercise';

interface ExerciseDetailViewProps {
  exercise: Exercise;
  formState: FormState;
  formConfig: FormConfig;
  isCardio: boolean;
  onSetsChange: (sets: number) => void;
  onWeightChange: (weight: number) => void;
  onDurationChange: (duration: number) => void;
  onAddExercise: () => void;
  onCompleteRoutine: () => void;
}

export function ExerciseDetailView({
  exercise,
  formState,
  formConfig,
  isCardio,
  onSetsChange,
  onWeightChange,
  onDurationChange,
  onAddExercise,
  onCompleteRoutine
}: ExerciseDetailViewProps) {
  const handleIncrement = (field: 'sets' | 'weight' | 'duration') => {
    const config = formConfig[field];
    const currentValue = formState[field];
    const newValue = Math.min(currentValue + config.step, config.max);
    
    switch (field) {
      case 'sets':
        onSetsChange(newValue);
        break;
      case 'weight':
        onWeightChange(newValue);
        break;
      case 'duration':
        onDurationChange(newValue);
        break;
    }
  };

  const handleDecrement = (field: 'sets' | 'weight' | 'duration') => {
    const config = formConfig[field];
    const currentValue = formState[field];
    const newValue = Math.max(currentValue - config.step, config.min);
    
    switch (field) {
      case 'sets':
        onSetsChange(newValue);
        break;
      case 'weight':
        onWeightChange(newValue);
        break;
      case 'duration':
        onDurationChange(newValue);
        break;
    }
  };

  const renderSpinner = (
    field: 'sets' | 'weight' | 'duration',
    label: string,
    unit: string,
    disabled = false
  ) => {
    const config = formConfig[field];
    const value = formState[field];
    const error = formState.errors[field];

    return (
      <div className="mb-6">
        <label className="block text-lg font-medium mb-3 text-gray-200">
          {label}
        </label>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => handleDecrement(field)}
            disabled={disabled || value <= config.min}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`${label} 감소`}
          >
            <span className="text-xl font-bold">-</span>
          </button>
          
          <div className="flex-1 text-center">
            <span className="text-3xl font-bold text-white">
              {value}
            </span>
            <span className="text-lg text-gray-400 ml-2">{unit}</span>
            {error && (
              <div className="text-red-400 text-sm mt-1">{error}</div>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => handleIncrement(field)}
            disabled={disabled || value >= config.max}
            className="w-12 h-12 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`${label} 증가`}
          >
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {exercise.name} 상세 설정
          </h1>
          <p className="text-gray-400 text-lg">
            운동 세부사항을 입력해주세요
          </p>
        </div>

        {/* Exercise Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-3">선택된 운동</h2>
          <div className="space-y-2">
            <p><span className="text-gray-400">운동명:</span> {exercise.name}</p>
            <p><span className="text-gray-400">부위:</span> {exercise.bodyPart}</p>
            {exercise.equipment && exercise.equipment.length > 0 && (
              <p><span className="text-gray-400">장비:</span> {exercise.equipment.join(', ')}</p>
            )}
            {exercise.difficulty && (
              <p><span className="text-gray-400">난이도:</span> {exercise.difficulty}</p>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">운동 설정</h2>
          
          {/* Sets */}
          {renderSpinner('sets', '세트 수', '세트')}
          
          {/* Weight (웨이트 운동만) */}
          {!isCardio && renderSpinner('weight', '중량', 'kg')}
          
          {/* Duration (유산소 운동만) */}
          {isCardio && renderSpinner('duration', '시간', '분')}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onAddExercise}
            disabled={!formState.isValid}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            운동 추가
          </button>
          
          <button
            onClick={onCompleteRoutine}
            disabled={!formState.isValid}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            루틴 완료
          </button>
        </div>
      </div>
    </div>
  );
} 