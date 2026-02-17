import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface RoutineExerciseRow {
  id: string;
  part: string;
  name: string;
  sets: number;
  weight?: number;
  reps?: number;
  duration?: number;
}

interface RoutineSummaryRow {
  id: string;
  title: string;
  exerciseCount: number;
  createdAt: Date;
  lastUsedAt: Date | null;
  exercises: RoutineExerciseRow[];
}

@Injectable()
export class RoutinesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSummariesByUserId(userId: string): Promise<RoutineSummaryRow[]> {
    const routines = await this.prisma.routine.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        routineExercises: {
          orderBy: {
            orderNo: 'asc'
          },
          include: {
            exercise: true
          }
        }
      }
    });

    return routines.map((routine) => {
      const exercises: RoutineExerciseRow[] = routine.routineExercises.map(
        (routineExercise) => ({
          id: routineExercise.id,
          part: routineExercise.exercise.bodyPart,
          name: routineExercise.exercise.name,
          sets: Math.max(1, routineExercise.targetSets ?? 1),
          weight:
            routineExercise.targetWeightKg === null
              ? undefined
              : Number(routineExercise.targetWeightKg),
          reps: routineExercise.targetReps ?? undefined,
          duration:
            routineExercise.targetDurationSeconds === null
              ? undefined
              : Math.max(1, Math.ceil(routineExercise.targetDurationSeconds / 60))
        })
      );

      return {
        id: routine.id,
        title: routine.title,
        exerciseCount: routine.routineExercises.length,
        exercises,
        createdAt: routine.createdAt,
        lastUsedAt: routine.lastUsedAt
      };
    });
  }

  async deleteByRoutineIdAndUserId(
    routineId: string,
    userId: string
  ): Promise<boolean> {
    const result = await this.prisma.routine.deleteMany({
      where: {
        id: routineId,
        userId
      }
    });

    return result.count > 0;
  }
}
