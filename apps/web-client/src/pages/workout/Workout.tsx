import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutView } from './WorkoutView';
import { 
  WorkoutSession, 
  WorkoutProgress, 
  TimerState, 
  ExerciseDetail,
  CompletedSet 
} from '../../types/exercise';

// 임시로 운동 데이터를 저장할 상태 (실제로는 전역 상태 관리나 API를 사용)
let tempWorkoutData: ExerciseDetail[] = [];

export function Workout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<WorkoutSession>({
    id: Date.now().toString(),
    exercises: tempWorkoutData,
    currentExerciseIndex: 0,
    currentSet: 1,
    startTime: new Date(),
    completedSets: [],
    status: 'active'
  });

  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeRemaining: 0,
    totalTime: 0,
    isPaused: false
  });

  const [isResting, setIsResting] = useState(false);

  // 현재 운동 정보 계산
  const currentExercise = session.exercises[session.currentExerciseIndex];
  const totalExercises = session.exercises.length;
  const totalSets = currentExercise?.sets || 0;

  // 진행률 계산
  const calculateProgress = useCallback((): WorkoutProgress => {
    if (!currentExercise) {
      return {
        currentExercise: {
          exerciseId: '',
          exerciseName: '',
          bodyPart: '',
          sets: 0
        },
        totalExercises: 0,
        currentExerciseIndex: 0,
        currentSet: 0,
        totalSets: 0,
        percentComplete: 0
      };
    }

    const totalSetsInWorkout = session.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSets = session.completedSets.length;
    const percentComplete = totalSetsInWorkout > 0 ? (completedSets / totalSetsInWorkout) * 100 : 0;

    return {
      currentExercise,
      totalExercises,
      currentExerciseIndex: session.currentExerciseIndex,
      currentSet: session.currentSet,
      totalSets,
      percentComplete
    };
  }, [currentExercise, session, totalExercises, totalSets]);

  // 타이머 관리
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isRunning && timerState.timeRemaining > 0) {
      interval = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeRemaining <= 1) {
            // 타이머 완료
            setIsResting(false);
            return {
              ...prev,
              isRunning: false,
              timeRemaining: 0
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerState.isRunning, timerState.timeRemaining]);

  // 세트 완료 처리
  const handleCompleteSet = useCallback(() => {
    if (!currentExercise) return;

    const completedSet: CompletedSet = {
      exerciseId: currentExercise.exerciseId,
      setNumber: session.currentSet,
      weight: currentExercise.weight,
      duration: currentExercise.duration,
      restTime: currentExercise.restTime || 60,
      completedAt: new Date(),
      completed: true
    };

    const newCompletedSets = [...session.completedSets, completedSet];
    
    // 다음 세트 또는 다음 운동으로 진행
    if (session.currentSet < totalSets) {
      // 다음 세트로 진행
      setSession(prev => ({
        ...prev,
        currentSet: prev.currentSet + 1,
        completedSets: newCompletedSets
      }));

      // 휴식 타이머 시작
      const restTime = currentExercise.restTime || 60;
      setTimerState({
        isRunning: true,
        timeRemaining: restTime,
        totalTime: restTime,
        isPaused: false
      });
      setIsResting(true);
    } else {
      // 다음 운동으로 진행
      if (session.currentExerciseIndex < totalExercises - 1) {
        setSession(prev => ({
          ...prev,
          currentExerciseIndex: prev.currentExerciseIndex + 1,
          currentSet: 1,
          completedSets: newCompletedSets
        }));
      } else {
        // 모든 운동 완료
        setSession(prev => ({
          ...prev,
          status: 'completed',
          completedSets: newCompletedSets
        }));
        const completionData = {
          sessionId: session.id,
          completedAt: new Date(),
          duration: Math.floor((Date.now() - session.startTime.getTime()) / 60000), // 분 단위
          exercises: session.exercises.map(exercise => ({
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
            bodyPart: exercise.bodyPart,
                            sets: newCompletedSets
                  .filter(set => set.exerciseId === exercise.exerciseId)
                  .map(set => ({
                    setNumber: set.setNumber,
                    exerciseId: set.exerciseId,
                    weight: set.weight,
                    reps: set.reps,
                    duration: set.duration,
                    restTime: set.restTime,
                    completedAt: set.completedAt,
                    completed: true,
                  })),
            totalWeight: newCompletedSets
              .filter(set => set.exerciseId === exercise.exerciseId)
              .reduce((sum, set) => sum + (set.weight || 0), 0),
          })),
          totalSets: newCompletedSets.length,
          totalWeight: newCompletedSets.reduce((sum, set) => sum + (set.weight || 0), 0),
          caloriesBurned: Math.floor((Date.now() - session.startTime.getTime()) / 60000) * 5, // 추정 칼로리
        };
        
        console.log('운동 완료:', completionData);
        navigate('/workout-complete', { state: { completionData } });
        return;
      }
    }

    console.log('세트 완료:', completedSet);
  }, [currentExercise, session, totalSets, totalExercises, navigate]);

  // 휴식 건너뛰기
  const handleSkipRest = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      timeRemaining: 0
    }));
    setIsResting(false);
  }, []);

  // 운동 일시정지
  const handlePauseWorkout = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'paused',
      pausedTime: Date.now()
    }));
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: true
    }));
    console.log('운동 일시정지');
  }, []);

  // 운동 재개
  const handleResumeWorkout = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'active'
    }));
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false
    }));
    console.log('운동 재개');
  }, []);

  // 운동 중단
  const handleAbandonWorkout = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'abandoned'
    }));
    console.log('운동 중단:', {
      sessionId: session.id,
      completedSets: session.completedSets,
      totalTime: Date.now() - session.startTime.getTime()
    });
    navigate('/preset-selection');
  }, [session, navigate]);

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">운동 데이터를 찾을 수 없습니다</h1>
          <p className="text-gray-400">프리셋을 다시 선택해주세요.</p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <WorkoutView
      progress={progress}
      timerState={timerState}
      isResting={isResting}
      onCompleteSet={handleCompleteSet}
      onSkipRest={handleSkipRest}
      onPauseWorkout={handlePauseWorkout}
      onResumeWorkout={handleResumeWorkout}
      onAbandonWorkout={handleAbandonWorkout}
    />
  );
}

// 임시 함수: 운동 데이터 설정 (실제로는 전역 상태 관리나 라우터 상태를 사용)
export const setTempWorkoutData = (exercises: ExerciseDetail[]) => {
  tempWorkoutData = exercises;
}; 