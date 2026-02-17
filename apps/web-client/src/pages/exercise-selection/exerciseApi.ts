import { Exercise } from '../../types/exercise';

interface ExerciseCatalogApiResponse {
  code: string;
  name: string;
  bodyPart: string;
  equipment?: string[];
  difficulty?: string;
}

interface ApiErrorResponse {
  message?: string;
}

const toExercise = (value: ExerciseCatalogApiResponse): Exercise => {
  const difficulty =
    value.difficulty === 'beginner' ||
    value.difficulty === 'intermediate' ||
    value.difficulty === 'advanced'
      ? value.difficulty
      : undefined;

  return {
    id: value.code,
    name: value.name,
    bodyPart: value.bodyPart,
    equipment: Array.isArray(value.equipment) ? value.equipment : [],
    difficulty
  };
};

export const fetchExercisesByBodyPart = async (
  bodyPartId: string
): Promise<Exercise[]> => {
  const response = await fetch(
    `/api/exercises/body-parts/${encodeURIComponent(bodyPartId)}/exercises`
  );

  const payload =
    (await response.json()) as ExerciseCatalogApiResponse[] | ApiErrorResponse;

  if (!response.ok) {
    const reason =
      typeof payload === 'object' && payload && 'message' in payload
        ? String(payload.message ?? '')
        : '';
    throw new Error(reason || '운동 목록 조회 요청에 실패했습니다.');
  }

  const rows = Array.isArray(payload) ? payload : [];
  return rows.map(toExercise);
};
