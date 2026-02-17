export interface RoutineExerciseSummaryDto {
  id: string;
  exerciseCode?: string;
  part: string;
  name: string;
  sets: number;
  weight?: number;
  reps?: number;
  duration?: number;
}

export interface RoutineSummaryDto {
  id: string;
  title: string;
  exerciseCount: number;
  exercises: RoutineExerciseSummaryDto[];
  createdAt: string;
  lastUsedAt: string | null;
}
