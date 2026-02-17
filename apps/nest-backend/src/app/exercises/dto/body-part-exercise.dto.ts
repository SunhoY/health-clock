export interface BodyPartExerciseDto {
  code: string;
  name: string;
  bodyPart: string;
  exerciseType: string;
  equipment: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}
