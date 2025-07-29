import { useParams, useNavigate } from 'react-router-dom';
import { ExerciseSelectionView } from './ExerciseSelectionView';
import { EXERCISES_DATA } from '../../types/exercise';
import { Exercise } from '../../types/exercise';

export function ExerciseSelection() {
  const { bodyPart } = useParams<{ bodyPart: string }>();
  const navigate = useNavigate();

  const selectedBodyPart = bodyPart || 'chest';
  const exercises = EXERCISES_DATA[selectedBodyPart] || [];

  const handleExerciseSelect = (exercise: Exercise) => {
    console.log('Selected exercise:', exercise);
    navigate(`/exercise-detail/${selectedBodyPart}/${exercise.id}`);
  };

  return (
    <ExerciseSelectionView
      selectedBodyPart={selectedBodyPart}
      exercises={exercises}
      onExerciseSelect={handleExerciseSelect}
    />
  );
} 