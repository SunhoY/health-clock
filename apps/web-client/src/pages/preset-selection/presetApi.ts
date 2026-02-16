import { ExerciseDetail } from '../../types/exercise';
import {
  deleteLocalPreset,
  getLocalPresetById,
  getLocalPresets,
  PresetItem,
  updateLocalPresetExercise
} from './presetStore';

export const fetchPresets = async (): Promise<PresetItem[]> => {
  return getLocalPresets();
};

export const deletePreset = async (presetId: string): Promise<void> => {
  deleteLocalPreset(presetId);
};

export const fetchPresetById = async (presetId: string): Promise<PresetItem | undefined> => {
  return getLocalPresetById(presetId);
};

export const updatePresetExercise = async (
  presetId: string,
  exercise: ExerciseDetail
): Promise<PresetItem | undefined> => {
  return updateLocalPresetExercise(presetId, exercise);
};
