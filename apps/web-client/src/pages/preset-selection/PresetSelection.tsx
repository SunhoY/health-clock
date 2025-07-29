import { useNavigate } from 'react-router-dom';
import { PresetSelectionView } from './PresetSelectionView';

// 임시 프리셋 데이터 (나중에 실제 데이터로 교체)
const mockPresets = [
  {
    id: '1',
    title: '전신 운동',
    exercises: [
      { id: '1', part: '전신', name: '스쿼트', sets: 3, weight: 50 },
      { id: '2', part: '상체', name: '푸시업', sets: 3 },
      { id: '3', part: '하체', name: '런지', sets: 3, weight: 20 },
    ],
    createdAt: new Date('2024-01-01'),
    lastUsed: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: '상체 집중',
    exercises: [
      { id: '4', part: '가슴', name: '벤치프레스', sets: 4, weight: 80 },
      { id: '5', part: '등', name: '로우', sets: 4, weight: 60 },
      { id: '6', part: '어깨', name: '밀리터리프레스', sets: 3, weight: 40 },
    ],
    createdAt: new Date('2024-01-10'),
    lastUsed: new Date('2024-01-20'),
  },
];

export const PresetSelection = () => {
  const navigate = useNavigate();

  const handlePresetSelect = (presetId: string) => {
    // TODO: 운동 진행 화면으로 라우팅
    console.log('선택된 프리셋:', presetId);
    // navigate('/workout', { state: { presetId } });
  };

  const handleAddWorkout = () => {
    navigate('/create-routine');
  };

  return (
    <PresetSelectionView
      presets={mockPresets}
      onPresetSelect={handlePresetSelect}
      onAddWorkout={handleAddWorkout}
    />
  );
}; 