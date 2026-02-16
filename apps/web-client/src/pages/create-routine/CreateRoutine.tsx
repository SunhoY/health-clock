import { useNavigate } from 'react-router-dom';
import { CreateRoutineView } from './CreateRoutineView';

// 운동 부위 데이터
const BODY_PARTS = [
  { id: 'chest', name: '가슴', exercises: ['벤치프레스', '인클라인 벤치프레스', '덤벨 플라이', '푸쉬업'] },
  { id: 'back', name: '등', exercises: ['바벨 로우', '렛풀다운', '데드리프트', '시티드 로우'] },
  { id: 'legs', name: '하체', exercises: ['스쿼트', '레그프레스', '레그컬', '런지'] },
  { id: 'shoulders', name: '어깨', exercises: ['숄더프레스', '사이드 레터럴 레이즈', '리어 델트 플라이'] },
  { id: 'arms', name: '팔', exercises: ['바이셉 컬', '트라이셉 익스텐션', '해머 컬'] },
  { id: 'abs', name: '복부', exercises: ['크런치', '플랭크', '레그레이즈', '러시안 트위스트'] },
  { id: 'calves', name: '종아리', exercises: ['카프 레이즈', '시티드 카프 레이즈'] },
  { id: 'fullbody', name: '전신', exercises: ['버피', '마운틴 클라이머', '스러스터'] },
  { id: 'cardio', name: '유산소', exercises: ['러닝머신', '싸이클', '스텝퍼', '줄넘기'] }
];

export const CreateRoutine = () => {
  const navigate = useNavigate();

  const handleBodyPartSelect = (bodyPartId: string) => {
    navigate(`/exercise-selection/${bodyPartId}`);
  };

  return (
    <CreateRoutineView
      bodyParts={BODY_PARTS}
      onBodyPartSelect={handleBodyPartSelect}
    />
  );
}; 
