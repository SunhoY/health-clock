export interface CreateBodyPartExerciseRequestDto {
  code: string;
  name: string;
  exerciseType: string;
  equipment?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}
