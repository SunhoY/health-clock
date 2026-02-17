import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreateRoutineView } from './CreateRoutineView';
import { BodyPartItem, fetchBodyParts } from './bodyPartApi';

export const CreateRoutine = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState =
    (location.state as
      | {
          mode?: 'create' | 'edit';
          presetId?: string;
        }
      | null) ?? null;

  const [bodyParts, setBodyParts] = useState<BodyPartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadBodyParts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const nextBodyParts = await fetchBodyParts();
      setBodyParts(nextBodyParts);
    } catch (error) {
      console.error('운동 부위 목록 조회에 실패했습니다.', error);
      setBodyParts([]);
      setLoadError('운동 부위 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (routeState?.mode === 'edit' && routeState.presetId) {
      navigate('/exercise-selection/edit', {
        replace: true,
        state: { mode: 'edit', presetId: routeState.presetId }
      });
      return;
    }

    void loadBodyParts();
  }, [loadBodyParts, navigate, routeState?.mode, routeState?.presetId]);

  const handleBodyPartSelect = (bodyPartId: string) => {
    navigate(`/exercise-selection/${bodyPartId}`);
  };

  return (
    <CreateRoutineView
      bodyParts={bodyParts}
      onBodyPartSelect={handleBodyPartSelect}
      isLoading={isLoading}
      loadError={loadError}
      onRetry={() => {
        void loadBodyParts();
      }}
    />
  );
};
