import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WorkoutCompleteView } from './WorkoutCompleteView';
import { 
  WorkoutCompletionData, 
  CelebrationMessage, 
  Achievement,
  UserStatistics 
} from '../../types/exercise';

interface WorkoutCompleteProps {
  completionData?: WorkoutCompletionData;
  userStats?: UserStatistics;
}

const CELEBRATION_MESSAGES: CelebrationMessage[] = [
  { id: '1', message: '와! 오늘도 완벽하게 해냈어요', emoji: '💪', category: 'general' },
  { id: '2', message: '몸이 기억할 거예요, 이 노력!', emoji: '✨', category: 'general' },
  { id: '3', message: '하루 한 걸음, 멋진 당신의 루틴!', emoji: '🏃‍♂️', category: 'consistency' },
  { id: '4', message: '대단해요! 자신과의 약속을 지켰어요.', emoji: '🎉', category: 'general' },
  { id: '5', message: '운동 완료! 이젠 쉬어도 좋아요', emoji: '😊', category: 'general' },
  { id: '6', message: '근육이 자라고 있어요!', emoji: '💪', category: 'strength' },
  { id: '7', message: '심폐지구력이 향상되고 있어요!', emoji: '❤️', category: 'cardio' },
];

const getRandomFromCategory = (category: string): CelebrationMessage => {
  const filteredMessages = CELEBRATION_MESSAGES.filter(msg => msg.category === category);
  if (filteredMessages.length === 0) {
    return CELEBRATION_MESSAGES[0]; // 기본 메시지
  }
  const randomIndex = Math.floor(Math.random() * filteredMessages.length);
  return filteredMessages[randomIndex];
};

const selectCelebrationMessage = (
  workoutData: WorkoutCompletionData,
  userStats?: UserStatistics
): CelebrationMessage => {
  // 운동 타입에 따른 메시지 필터링
  const exerciseTypes = workoutData.exercises.map(ex => ex.bodyPart);
  const isCardioFocused = exerciseTypes.includes('cardio');
  const isStrengthFocused = exerciseTypes.some(type => type !== 'cardio');
  
  // 연속 운동 일수에 따른 메시지
  if (userStats?.currentStreak && userStats.currentStreak >= 7) {
    return getRandomFromCategory('consistency');
  }
  
  // 운동 타입별 메시지
  if (isCardioFocused && !isStrengthFocused) {
    return getRandomFromCategory('cardio');
  } else if (isStrengthFocused && !isCardioFocused) {
    return getRandomFromCategory('strength');
  }
  
  // 기본 메시지
  return getRandomFromCategory('general');
};

const checkAchievements = (
  workoutData: WorkoutCompletionData,
  userStats?: UserStatistics
): Achievement[] => {
  const achievements: Achievement[] = [];
  
  // 첫 운동 완료 체크
  if (userStats?.totalWorkouts === 1) {
    achievements.push({
      id: 'first-workout',
      title: '첫 운동 완료',
      description: '첫 번째 운동을 완료했습니다!',
      icon: '🎯',
      unlockedAt: new Date(),
      category: 'frequency',
    });
  }
  
  // 연속 운동 체크
  if (userStats?.currentStreak === 7) {
    achievements.push({
      id: 'week-streak',
      title: '7일 연속 운동',
      description: '일주일 연속으로 운동을 완료했습니다!',
      icon: '🔥',
      unlockedAt: new Date(),
      category: 'streak',
    });
  }
  
  // 장시간 운동 체크
  if (workoutData.duration >= 60) {
    achievements.push({
      id: 'long-workout',
      title: '장시간 운동',
      description: '1시간 이상 운동을 완료했습니다!',
      icon: '⏰',
      unlockedAt: new Date(),
      category: 'volume',
    });
  }
  
  // 고중량 운동 체크
  if (workoutData.totalWeight && workoutData.totalWeight >= 500) {
    achievements.push({
      id: 'heavy-lifting',
      title: '고중량 운동',
      description: '총 500kg 이상을 들어올렸습니다!',
      icon: '🏋️‍♂️',
      unlockedAt: new Date(),
      category: 'personal_best',
    });
  }
  
  return achievements;
};

export const WorkoutComplete = ({ completionData, userStats }: WorkoutCompleteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL state에서 completionData를 가져오거나 props에서 가져옴
  const workoutData = completionData || location.state?.completionData;
  
  // 운동 완료 데이터 저장
  const saveWorkoutData = useCallback(() => {
    if (workoutData) {
      console.log('운동 완료 데이터 저장:', workoutData);
      // TODO: 실제 데이터 저장 로직 구현
    }
  }, [workoutData]);
  
  // 사용자 통계 업데이트
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
  
  // completionData가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!workoutData) {
      navigate('/', { replace: true });
    }
  }, [workoutData, navigate]);
  
  // 컴포넌트 마운트 시 데이터 저장 및 통계 업데이트
  useEffect(() => {
    if (workoutData) {
      saveWorkoutData();
      updateUserStats();
    }
  }, [workoutData, saveWorkoutData, updateUserStats]);
  
  // completionData가 없으면 로딩 상태 표시
  if (!workoutData) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">로딩 중...</div>;
  }
  
  const celebrationMessage = selectCelebrationMessage(workoutData, userStats);
  const achievements = checkAchievements(workoutData, userStats);
  
  const handleViewSummary = () => {
    navigate('/workout-summary', { state: { completionData } });
  };
  
  const handleStartNewWorkout = () => {
    navigate('/preset-selection');
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
    <WorkoutCompleteView
      completionData={workoutData}
      celebrationMessage={celebrationMessage}
      achievements={achievements}
      onViewSummary={handleViewSummary}
      onStartNewWorkout={handleStartNewWorkout}
      onGoHome={handleGoHome}
    />
  );
}; 