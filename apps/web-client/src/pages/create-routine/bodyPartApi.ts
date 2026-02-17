export interface BodyPartItem {
  id: string;
  name: string;
}

interface BodyPartApiResponse {
  id: string;
  name: string;
}

const toBodyPartItem = (value: unknown): BodyPartItem | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  if (typeof candidate.id !== 'string' || typeof candidate.name !== 'string') {
    return null;
  }

  const id = candidate.id.trim();
  const name = candidate.name.trim();
  if (!id || !name) {
    return null;
  }

  return {
    id,
    name
  };
};

export const fetchBodyParts = async (): Promise<BodyPartItem[]> => {
  const response = await fetch('/api/exercises/body-parts');
  const payload =
    (await response.json()) as
      | BodyPartApiResponse[]
      | {
          message?: string;
        };

  if (!response.ok) {
    const reason =
      typeof payload === 'object' && payload && 'message' in payload
        ? String(payload.message ?? '')
        : '';
    throw new Error(reason || '운동 부위 목록 조회 요청에 실패했습니다.');
  }

  const items = Array.isArray(payload) ? payload : [];
  return items
    .map((item) => toBodyPartItem(item))
    .filter((item): item is BodyPartItem => item !== null);
};
