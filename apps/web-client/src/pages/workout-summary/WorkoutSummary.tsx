import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WorkoutSummaryView } from './WorkoutSummaryView';
import {
  WorkoutCompletionData,
  WorkoutDetailSummaryViewModel,
  WorkoutDetailSummarySection,
  WorkoutBodyPart
} from '../../types/exercise';

interface WorkoutSummaryProps {
  targetDate?: Date;
}

let tempWorkoutSessions: WorkoutCompletionData[] = [];

// TODO: 서버 연동 전까지 상세 요약 화면의 기본 노출을 위한 임시 데이터
const DEFAULT_DETAIL_SUMMARY_VIEW_MODEL: WorkoutDetailSummaryViewModel = {
  todayBodyParts: ['cardio', 'upper', 'lower', 'core'],
  sections: [
    { bodyPart: 'cardio', label: '유산소', caloriesBurned: 320 },
    { bodyPart: 'upper', label: '상체', totalSets: 8, maxWeight: 60 },
    { bodyPart: 'lower', label: '하체', totalSets: 6, maxWeight: 100 },
    { bodyPart: 'core', label: '코어', totalSets: 4, maxWeight: 20 },
  ],
};

const toDayRange = (date: Date) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  return { dayStart, dayEnd };
};

const mapToBodyPart = (bodyPart: string): WorkoutBodyPart | undefined => {
  if (bodyPart === 'cardio') return 'cardio';
  if (['chest', 'back', 'shoulders', 'arms'].includes(bodyPart)) return 'upper';
  if (['legs', 'calves'].includes(bodyPart)) return 'lower';
  if (['abs', 'core'].includes(bodyPart)) return 'core';
  return undefined;
};

const buildDetailViewModel = (
  workoutSessions: WorkoutCompletionData[],
  targetDate: Date
): WorkoutDetailSummaryViewModel => {
  const { dayStart, dayEnd } = toDayRange(targetDate);
  const dailySessions = workoutSessions.filter(session =>
    session.completedAt >= dayStart && session.completedAt <= dayEnd
  );

  const sectionMap = new Map<WorkoutBodyPart, WorkoutDetailSummarySection>();

  dailySessions.forEach(session => {
    let cardioCaloriesAdded = false;
    session.exercises.forEach(exercise => {
      const bodyPart = mapToBodyPart(exercise.bodyPart);
      if (!bodyPart) return;

      if (bodyPart === 'cardio') {
        const base = sectionMap.get('cardio') ?? {
          bodyPart: 'cardio' as const,
          label: '유산소',
          caloriesBurned: 0,
        };

        if (!cardioCaloriesAdded) {
          const estimated = session.caloriesBurned ?? 0;
          base.caloriesBurned = (base.caloriesBurned ?? 0) + estimated;
          cardioCaloriesAdded = true;
        }
        sectionMap.set('cardio', base);
        return;
      }

      const labelMap: Record<'upper' | 'lower' | 'core', string> = {
        upper: '상체',
        lower: '하체',
        core: '코어',
      };

      const base = sectionMap.get(bodyPart) ?? {
        bodyPart,
        label: labelMap[bodyPart],
        totalSets: 0,
        maxWeight: 0,
      };

      const setCount = exercise.sets.length;
      const exerciseMaxWeight = exercise.sets.reduce((max, set) => Math.max(max, set.weight ?? 0), 0);

      base.totalSets = (base.totalSets ?? 0) + setCount;
      base.maxWeight = Math.max(base.maxWeight ?? 0, exerciseMaxWeight);
      sectionMap.set(bodyPart, base);
    });
  });

  const sectionOrder: WorkoutBodyPart[] = ['cardio', 'upper', 'lower', 'core'];
  const sections = sectionOrder
    .map(part => sectionMap.get(part))
    .filter((section): section is WorkoutDetailSummarySection => {
      if (!section) return false;
      if (section.bodyPart === 'cardio') {
        return (section.caloriesBurned ?? 0) > 0;
      }
      return (section.totalSets ?? 0) > 0;
    });

  return {
    todayBodyParts: sections.map(section => section.bodyPart),
    sections,
  };
};

export const WorkoutSummary = ({ targetDate }: WorkoutSummaryProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewModel, setViewModel] = useState<WorkoutDetailSummaryViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completionData = location.state?.completionData;
    if (completionData) {
      tempWorkoutSessions.push(completionData);
      console.log('운동 완료 데이터가 요약 화면에 추가됨:', completionData);
    }
  }, [location.state]);

  useEffect(() => {
    const date = targetDate || new Date();
    const nextViewModel = buildDetailViewModel(tempWorkoutSessions, date);
    // 서버/세션 데이터가 없는 경우에도 상세 요약 화면이 비어 보이지 않도록 임시값 표시
    setViewModel(nextViewModel.sections.length > 0 ? nextViewModel : DEFAULT_DETAIL_SUMMARY_VIEW_MODEL);
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

  if (!viewModel) {
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
      viewModel={viewModel}
      onGoBack={handleGoBack}
      onGoHome={handleGoHome}
    />
  );
};

export const setTempWorkoutSessions = (sessions: WorkoutCompletionData[]) => {
  tempWorkoutSessions = sessions;
};
