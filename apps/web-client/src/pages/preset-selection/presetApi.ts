import { deleteLocalPreset, getLocalPresets, PresetItem } from './presetStore';

export const fetchPresets = async (): Promise<PresetItem[]> => {
  return getLocalPresets();
};

export const deletePreset = async (presetId: string): Promise<void> => {
  deleteLocalPreset(presetId);
};
