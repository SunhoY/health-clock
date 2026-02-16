import { useNavigate } from 'react-router-dom';
import { PresetSelectionView } from './PresetSelectionView';
import { ExerciseDetail } from '../../types/exercise';
import { getLocalPresets } from './presetStore';

export const PresetSelection = () => {
  const navigate = useNavigate();
  const presets = getLocalPresets();

  const toExerciseDetails = (
    exercises: typeof presets[number]['exercises']
  ): ExerciseDetail[] =>
    exercises.map((exercise) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.part,
      sets: exercise.sets,
      weight: exercise.weight,
      duration: exercise.duration,
      restTime: 60,
    }));

  const handlePresetSelect = (presetId: string) => {
    const selectedPreset = presets.find((preset) => preset.id === presetId);
    if (!selectedPreset) return;

    console.log('선택된 프리셋:', presetId);
    navigate('/workout', {
      state: {
        presetId: selectedPreset.id,
        presetTitle: selectedPreset.title,
        exercises: toExerciseDetails(selectedPreset.exercises),
      },
    });
  };

  const handleAddWorkout = () => {
    navigate('/create-routine');
  };

  return (
    <PresetSelectionView
      presets={presets}
      onPresetSelect={handlePresetSelect}
      onAddWorkout={handleAddWorkout}
    />
  );
}; 
