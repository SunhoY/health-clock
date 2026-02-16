import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WorkoutCompleteView } from './WorkoutCompleteView';
import {
  WorkoutCompletionData,
  UserStatistics
} from '../../types/exercise';

interface WorkoutCompleteProps {
  completionData?: WorkoutCompletionData;
  userStats?: UserStatistics;
}

export const WorkoutComplete = ({ completionData, userStats }: WorkoutCompleteProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const workoutData = completionData || location.state?.completionData;

  const saveWorkoutData = useCallback(() => {
    if (workoutData) {
      console.log('운동 완료 데이터 저장:', workoutData);
      // TODO: 실제 데이터 저장 로직 구현
    }
  }, [workoutData]);

  const updateUserStats = useCallback(() => {
    if (workoutData) {
      console.log('사용자 통계 업데이트:', {
        totalWorkouts: (userStats?.totalWorkouts || 0) + 1,
        totalDuration: (userStats?.totalDuration || 0) + workoutData.duration,
        currentStreak: userStats?.currentStreak || 1,
      });
      // TODO: 실제 통계 업데이트 로직 구현
    }
  }, [workoutData, userStats]);

  useEffect(() => {
    if (!workoutData) {
      navigate('/', { replace: true });
    }
  }, [workoutData, navigate]);

  useEffect(() => {
    if (workoutData) {
      saveWorkoutData();
      updateUserStats();
    }
  }, [workoutData, saveWorkoutData, updateUserStats]);

  if (!workoutData) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">로딩 중...</div>;
  }

  const handleViewSummary = () => {
    navigate('/workout-summary', { state: { completionData: workoutData } });
  };

  const handleFinishWorkout = () => {
    navigate('/');
  };

  return (
    <WorkoutCompleteView
      completionData={workoutData}
      onViewSummary={handleViewSummary}
      onFinishWorkout={handleFinishWorkout}
    />
  );
};
