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

export interface ExerciseDetail {
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  sets: number;
  weight?: number; // 유산소 운동일 경우 null
  reps?: number;
  duration?: number; // 유산소 운동일 경우 필수
  restTime?: number; // 세트 간 휴식 시간 (기본값 설정)
}

export interface FormState {
  sets: number;
  weight: number;
  duration: number;
  isValid: boolean;
  errors: {
    sets?: string;
    weight?: string;
    duration?: string;
  };
}

export interface FormConfig {
  sets: {
    min: number;
    max: number;
    step: number;
    default: number;
  };
  weight: {
    min: number;
    max: number;
    step: number;
    default: number;
  };
  duration: {
    min: number;
    max: number;
    step: number;
    default: number;
  };
}

export interface RoutineTitleForm {
  title: string;
  isValid: boolean;
  error?: string;
}

export interface SaveRoutinePayload {
  title: string;
  exercises: ExerciseDetail[];
  createdAt: Date;
}

export interface ValidationRules {
  title: {
    minLength: number;
    maxLength: number;
    pattern?: RegExp;
    forbiddenWords?: string[];
  };
}

export interface WorkoutSession {
  id: string;
  presetId?: string;
  exercises: ExerciseDetail[];
  currentExerciseIndex: number;
  currentSet: number;
  startTime: Date;
  pausedTime?: number;
  completedSets: CompletedSet[];
  status: 'active' | 'paused' | 'completed' | 'abandoned';
}

export interface CompletedSet {
  setNumber: number;
  exerciseId: string;
  weight?: number;
  reps?: number;
  duration?: number; // 초 단위
  restTime?: number; // 휴식 시간 (초)
  completedAt?: Date;
  completed: boolean;
}

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  totalTime: number;
  isPaused: boolean;
}

export interface WorkoutProgress {
  currentExercise: ExerciseDetail;
  totalExercises: number;
  currentExerciseIndex: number;
  currentSet: number;
  totalSets: number;
  percentComplete: number;
}

export interface WorkoutViewModel {
  exerciseName: string;
  currentExerciseIndex: number;
  totalExercises: number;
  currentSet: number;
  totalSets: number;
  percentComplete: number;
  weight?: number;
  reps?: number;
  duration?: number;
  previousSetLabel?: string;
  previousWeight?: number;
  previousReps?: number;
  previousDuration?: number;
  nextSetLabel?: string;
  nextWeight?: number;
  nextReps?: number;
  nextDuration?: number;
}

export const FORM_CONFIG: FormConfig = {
  sets: { min: 1, max: 10, step: 1, default: 3 },
  weight: { min: 0, max: 500, step: 5, default: 20 },
  duration: { min: 1, max: 180, step: 1, default: 30 }
};

export const VALIDATION_RULES: ValidationRules = {
  title: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[가-힣a-zA-Z0-9\s\-_]+$/,
    forbiddenWords: ['undefined', 'null', 'test']
  }
};

export const generateDefaultTitle = (exercises: ExerciseDetail[]): string => {
  const bodyParts = [...new Set(exercises.map(ex => ex.bodyPart))];
  const today = new Date().toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  });
  
  if (bodyParts.length === 1) {
    return `${bodyParts[0]} 루틴 (${today})`;
  } else {
    return `복합 루틴 (${today})`;
  }
};

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

export interface WorkoutCompletionData {
  sessionId: string;
  completedAt: Date;
  duration: number; // 전체 운동 시간 (분)
  exercises: CompletedExercise[];
  totalSets: number;
  totalWeight?: number; // 총 중량 (kg)
  totalCardioTime?: number; // 총 유산소 시간 (분)
  caloriesBurned?: number; // 추정 소모 칼로리
}

export interface CompletedExercise {
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  sets: CompletedSet[];
  totalWeight?: number;
  totalDuration?: number;
}

export interface CompletedSet {
  setNumber: number;
  weight?: number;
  reps?: number;
  duration?: number; // 초 단위
  completed: boolean;
}

export interface CelebrationMessage {
  id: string;
  message: string;
  emoji: string;
  category: 'general' | 'strength' | 'cardio' | 'consistency';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'streak' | 'volume' | 'frequency' | 'personal_best';
}

export interface UserStatistics {
  currentStreak?: number;
  totalWorkouts?: number;
  totalDuration?: number;
} 

export interface DailyWorkoutSummary {
  date: Date;
  totalSessions: number;
  totalDuration: number; // 분
  totalExercises: number;
  totalSets: number;
  totalWeight?: number; // kg
  totalCardioTime?: number; // 분
  estimatedCalories?: number;
  exercises: ExerciseSummary[];
}

export interface ExerciseSummary {
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  type: 'weight' | 'cardio';
  totalSets: number;
  totalWeight?: number;
  totalDuration?: number;
  avgWeight?: number;
  maxWeight?: number;
  sessions: string[]; // 세션 ID 목록
}

export interface WorkoutDisplayFormat {
  weight: {
    format: (exercise: ExerciseSummary) => string;
  };
  cardio: {
    format: (exercise: ExerciseSummary) => string;
  };
}

export interface SummaryStatistics {
  workoutFrequency: number; // 이번 주 운동 횟수
  weeklyProgress: number; // 주간 진행률 (%)
  favoriteBodyPart: string; // 가장 많이 한 부위
  strongestLift?: { exercise: string; weight: number };
  longestCardio?: { exercise: string; duration: number };
} 
