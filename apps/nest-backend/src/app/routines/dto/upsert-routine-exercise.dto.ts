export interface UpsertRoutineExerciseSetDto {
  setNumber: number;
  weight?: number;
  reps?: number;
}

export interface UpsertRoutineExerciseRequestDto {
  exerciseId: string;
  bodyPart: string;
  exerciseName: string;
  sets: number;
  weight?: number;
  reps?: number;
  duration?: number;
  restTime?: number;
  setDetails?: UpsertRoutineExerciseSetDto[];
}

export interface AppendRoutineExerciseResponseDto {
  id: string;
}
