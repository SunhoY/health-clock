export interface CreateRoutineExerciseSetDto {
  setNumber: number;
  weight?: number;
  reps?: number;
}

export interface CreateRoutineExerciseDto {
  exerciseId: string;
  bodyPart: string;
  exerciseName: string;
  sets: number;
  weight?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  setDetails?: CreateRoutineExerciseSetDto[];
}

export interface CreateRoutineRequestDto {
  title: string;
  exercises: CreateRoutineExerciseDto[];
}

export interface CreateRoutineResponseDto {
  id: string;
  title: string;
  exerciseCount: number;
  createdAt: string;
  lastUsedAt: string | null;
}
