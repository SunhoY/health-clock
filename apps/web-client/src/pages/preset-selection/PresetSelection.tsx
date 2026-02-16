import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PresetSelectionView } from './PresetSelectionView';
import { ExerciseDetail } from '../../types/exercise';
import { fetchPresets, deletePreset } from './presetApi';
import { getLocalPresets } from './presetStore';

export const PresetSelection = () => {
  const navigate = useNavigate();
  const [presets, setPresets] = useState(getLocalPresets());

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

  const handleEditPreset = (presetId: string) => {
    navigate('/create-routine', { state: { mode: 'edit', presetId } });
  };

  const handleDeletePreset = async (presetId: string) => {
    const exists = presets.some((preset) => preset.id === presetId);
    if (!exists) {
      return;
    }

    try {
      await deletePreset(presetId);
      const nextPresets = await fetchPresets();
      setPresets(nextPresets);
    } catch (error) {
      console.error('프리셋 삭제에 실패했습니다.', error);
    }
  };

  return (
    <PresetSelectionView
      presets={presets}
      onPresetSelect={handlePresetSelect}
      onAddWorkout={handleAddWorkout}
      onEditPreset={handleEditPreset}
      onDeletePreset={handleDeletePreset}
    />
  );
}; 
