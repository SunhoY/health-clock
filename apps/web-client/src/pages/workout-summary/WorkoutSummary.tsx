import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WorkoutSummaryView } from './WorkoutSummaryView';
import { 
  DailyWorkoutSummary, 
  ExerciseSummary,
  WorkoutCompletionData 
} from '../../types/exercise';

interface WorkoutSummaryProps {
  targetDate?: Date;
}

// 임시 데이터 저장소 (실제로는 전역 상태 관리나 API를 사용)
let tempWorkoutSessions: WorkoutCompletionData[] = [];

const aggregateExercisesByDay = (
  workoutSessions: WorkoutCompletionData[],
  targetDate: Date
): DailyWorkoutSummary => {
  const dayStart = new Date(targetDate);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(targetDate);
  dayEnd.setHours(23, 59, 59, 999);
  
  const dailySessions = workoutSessions.filter(session =>
    session.completedAt >= dayStart && session.completedAt <= dayEnd
  );

  const exerciseMap = new Map<string, ExerciseSummary>();
  let totalDuration = 0;
  let totalSets = 0;
  let totalWeight = 0;
  let totalCardioTime = 0;

  dailySessions.forEach(session => {
    totalDuration += session.duration;
    
    session.exercises.forEach(exercise => {
      const key = `${exercise.exerciseId}-${exercise.bodyPart}`;
      const existing = exerciseMap.get(key) || {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        bodyPart: exercise.bodyPart,
        type: exercise.bodyPart === 'cardio' ? 'cardio' : 'weight',
        totalSets: 0,
        totalWeight: 0,
        totalDuration: 0,
        sessions: []
      };

      existing.totalSets += exercise.sets.length;
      existing.sessions.push(session.sessionId);
      
      if (existing.type === 'weight') {
        const exerciseWeight = exercise.sets.reduce((sum, set) => 
          sum + ((set.weight || 0) * (set.reps || 0)), 0);
        existing.totalWeight = (existing.totalWeight || 0) + exerciseWeight;
        totalWeight += exerciseWeight;
        totalSets += exercise.sets.length;
      } else {
        const exerciseDuration = exercise.sets.reduce((sum, set) => 
          sum + (set.duration || 0), 0);
        existing.totalDuration = (existing.totalDuration || 0) + exerciseDuration;
        totalCardioTime += exerciseDuration;
      }

      exerciseMap.set(key, existing);
    });
  });

  // 평균 중량과 최대 중량 계산
  exerciseMap.forEach(exercise => {
    if (exercise.type === 'weight' && exercise.totalWeight && exercise.totalSets > 0) {
      exercise.avgWeight = Math.round(exercise.totalWeight / exercise.totalSets);
      // 최대 중량은 실제로는 세트별 데이터에서 계산해야 하지만, 여기서는 임시로 평균의 1.2배로 설정
      exercise.maxWeight = Math.round(exercise.avgWeight * 1.2);
    }
  });

  // 칼로리 추정 (간단한 공식)
  const estimateCaloriesBurned = (weight: number, cardioTime: number, totalTime: number): number => {
    const weightCalories = weight * 0.1; // 중량당 0.1kcal
    const cardioCalories = cardioTime * 0.5; // 분당 0.5kcal
    const timeCalories = totalTime * 2; // 분당 2kcal (기본 활동)
    return Math.round(weightCalories + cardioCalories + timeCalories);
  };

  return {
    date: targetDate,
    totalSessions: dailySessions.length,
    totalDuration,
    totalExercises: exerciseMap.size,
    totalSets,
    totalWeight: totalWeight > 0 ? totalWeight : undefined,
    totalCardioTime: totalCardioTime > 0 ? totalCardioTime : undefined,
    estimatedCalories: estimateCaloriesBurned(totalWeight, totalCardioTime, totalDuration),
    exercises: Array.from(exerciseMap.values())
  };
};

export const WorkoutSummary = ({ targetDate }: WorkoutSummaryProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [summary, setSummary] = useState<DailyWorkoutSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // URL state에서 completionData를 가져와서 임시 저장소에 추가
  useEffect(() => {
    const completionData = location.state?.completionData;
    if (completionData) {
      tempWorkoutSessions.push(completionData);
      console.log('운동 완료 데이터가 요약 화면에 추가됨:', completionData);
    }
  }, [location.state]);

  // 날짜별 운동 데이터 조회 및 집계
  useEffect(() => {
    const date = targetDate || new Date();
    console.log('날짜별 운동 데이터 조회:', date.toDateString());
    
    const dailySummary = aggregateExercisesByDay(tempWorkoutSessions, date);
    console.log('운동 데이터 집계 결과:', dailySummary);
    
    setSummary(dailySummary);
    setLoading(false);
  }, [targetDate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">로딩 중...</div>
          <div className="text-gray-400">운동 데이터를 불러오고 있습니다.</div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">데이터를 찾을 수 없습니다</div>
          <div className="text-gray-400">운동 데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <WorkoutSummaryView
      summary={summary}
      onGoBack={handleGoBack}
      onGoHome={handleGoHome}
    />
  );
};

// 임시 함수: 운동 세션 데이터 설정 (실제로는 전역 상태 관리나 API를 사용)
export const setTempWorkoutSessions = (sessions: WorkoutCompletionData[]) => {
  tempWorkoutSessions = sessions;
}; 