import { useParams } from 'react-router-dom';
import { ExerciseSelectionView } from './ExerciseSelectionView';
import { EXERCISES_DATA } from '../../types/exercise';
import { Exercise } from '../../types/exercise';

export function ExerciseSelection() {
  const { bodyPart } = useParams<{ bodyPart: string }>();
  
  const selectedBodyPart = bodyPart || 'chest';
  const exercises = EXERCISES_DATA[selectedBodyPart] || [];

  const handleExerciseSelect = (exercise: Exercise) => {
    console.log('Selected exercise:', exercise);
    // TODO: 다음 화면으로 라우팅 (운동 상세 입력 화면)
  };

  return (
    <ExerciseSelectionView
      selectedBodyPart={selectedBodyPart}
      exercises={exercises}
      onExerciseSelect={handleExerciseSelect}
    />
  );
} 