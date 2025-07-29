export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  description?: string;
  instructions?: string[];
  equipment?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ExercisesByBodyPart {
  [bodyPart: string]: Exercise[];
}

export const EXERCISES_DATA: ExercisesByBodyPart = {
  chest: [
    { id: 'bench-press', name: '벤치프레스', bodyPart: 'chest', equipment: ['바벨', '벤치'] },
    { id: 'incline-bench-press', name: '인클라인 벤치프레스', bodyPart: 'chest', equipment: ['바벨', '인클라인 벤치'] },
    { id: 'dumbbell-fly', name: '덤벨 플라이', bodyPart: 'chest', equipment: ['덤벨', '벤치'] },
    { id: 'push-up', name: '푸쉬업', bodyPart: 'chest', equipment: [] }
  ],
  back: [
    { id: 'barbell-row', name: '바벨 로우', bodyPart: 'back', equipment: ['바벨'] },
    { id: 'lat-pulldown', name: '렛풀다운', bodyPart: 'back', equipment: ['케이블 머신'] },
    { id: 'deadlift', name: '데드리프트', bodyPart: 'back', equipment: ['바벨'] },
    { id: 'seated-row', name: '시티드 로우', bodyPart: 'back', equipment: ['케이블 머신'] }
  ],
  legs: [
    { id: 'squat', name: '스쿼트', bodyPart: 'legs', equipment: ['바벨'] },
    { id: 'leg-press', name: '레그프레스', bodyPart: 'legs', equipment: ['레그프레스 머신'] },
    { id: 'leg-curl', name: '레그컬', bodyPart: 'legs', equipment: ['레그컬 머신'] },
    { id: 'lunge', name: '런지', bodyPart: 'legs', equipment: ['덤벨'] }
  ],
  shoulders: [
    { id: 'shoulder-press', name: '숄더프레스', bodyPart: 'shoulders', equipment: ['바벨'] },
    { id: 'lateral-raise', name: '사이드 레터럴 레이즈', bodyPart: 'shoulders', equipment: ['덤벨'] },
    { id: 'rear-delt-fly', name: '리어 델트 플라이', bodyPart: 'shoulders', equipment: ['덤벨'] }
  ],
  arms: [
    { id: 'bicep-curl', name: '바이셉 컬', bodyPart: 'arms', equipment: ['덤벨'] },
    { id: 'tricep-extension', name: '트라이셉 익스텐션', bodyPart: 'arms', equipment: ['덤벨'] },
    { id: 'hammer-curl', name: '해머 컬', bodyPart: 'arms', equipment: ['덤벨'] }
  ],
  abs: [
    { id: 'crunch', name: '크런치', bodyPart: 'abs', equipment: [] },
    { id: 'plank', name: '플랭크', bodyPart: 'abs', equipment: [] },
    { id: 'leg-raise', name: '레그레이즈', bodyPart: 'abs', equipment: [] },
    { id: 'russian-twist', name: '러시안 트위스트', bodyPart: 'abs', equipment: [] }
  ],
  calves: [
    { id: 'calf-raise', name: '카프 레이즈', bodyPart: 'calves', equipment: ['덤벨'] },
    { id: 'seated-calf-raise', name: '시티드 카프 레이즈', bodyPart: 'calves', equipment: ['카프 머신'] }
  ],
  fullbody: [
    { id: 'burpee', name: '버피', bodyPart: 'fullbody', equipment: [] },
    { id: 'mountain-climber', name: '마운틴 클라이머', bodyPart: 'fullbody', equipment: [] },
    { id: 'thruster', name: '스러스터', bodyPart: 'fullbody', equipment: ['덤벨'] }
  ],
  cardio: [
    { id: 'treadmill', name: '러닝머신', bodyPart: 'cardio', equipment: ['러닝머신'] },
    { id: 'stationary-bike', name: '싸이클', bodyPart: 'cardio', equipment: ['실내 자전거'] },
    { id: 'stepper', name: '스텝퍼', bodyPart: 'cardio', equipment: ['스텝퍼'] },
    { id: 'jump-rope', name: '줄넘기', bodyPart: 'cardio', equipment: ['줄넘기'] }
  ]
}; 