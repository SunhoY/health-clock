import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface RoutineExerciseRow {
  id: string;
  exerciseCode: string;
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

export interface RoutineExerciseLookupRow {
  id: string;
  code: string;
}

interface RoutineExerciseSetCreateRow {
  setNo: number;
  targetWeightKg?: number;
  targetReps: number;
}

interface RoutineExerciseCreateRow {
  exerciseId: string;
  metricType: 'set_based' | 'duration_based';
  targetSets?: number;
  targetReps?: number;
  targetWeightKg?: number;
  targetDurationSeconds?: number;
  restSeconds?: number;
  setDetails: RoutineExerciseSetCreateRow[];
}

export interface RoutineCreateRow {
  title: string;
  exercises: RoutineExerciseCreateRow[];
}

interface RoutineCreatedRow {
  id: string;
  title: string;
  exerciseCount: number;
  createdAt: Date;
  lastUsedAt: Date | null;
}

interface RoutineExerciseCreatedRow {
  id: string;
}

@Injectable()
export class RoutinesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findExercisesByCodes(codes: string[]): Promise<RoutineExerciseLookupRow[]> {
    if (codes.length === 0) {
      return [];
    }

    return this.prisma.exercise.findMany({
      where: {
        code: {
          in: codes
        },
        isActive: true
      },
      select: {
        id: true,
        code: true
      }
    });
  }

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
          exerciseCode: routineExercise.exercise.code,
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

  async createByUserId(userId: string, row: RoutineCreateRow): Promise<RoutineCreatedRow> {
    return this.prisma.$transaction(async (tx) => {
      const routine = await tx.routine.create({
        data: {
          userId,
          title: row.title
        }
      });

      for (const [index, exercise] of row.exercises.entries()) {
        const routineExercise = await tx.routineExercise.create({
          data: {
            routineId: routine.id,
            exerciseId: exercise.exerciseId,
            orderNo: index + 1,
            metricType: exercise.metricType,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps,
            targetWeightKg: exercise.targetWeightKg,
            targetDurationSeconds: exercise.targetDurationSeconds,
            restSeconds: exercise.restSeconds
          }
        });

        if (exercise.setDetails.length > 0) {
          await tx.routineExerciseSet.createMany({
            data: exercise.setDetails.map((setDetail) => ({
              routineExerciseId: routineExercise.id,
              setNo: setDetail.setNo,
              targetWeightKg: setDetail.targetWeightKg,
              targetReps: setDetail.targetReps
            }))
          });
        }
      }

      return {
        id: routine.id,
        title: routine.title,
        exerciseCount: row.exercises.length,
        createdAt: routine.createdAt,
        lastUsedAt: routine.lastUsedAt
      };
    });
  }

  async appendExerciseByRoutineIdAndUserId(
    routineId: string,
    userId: string,
    row: RoutineExerciseCreateRow
  ): Promise<RoutineExerciseCreatedRow | null> {
    return this.prisma.$transaction(async (tx) => {
      const routine = await tx.routine.findFirst({
        where: {
          id: routineId,
          userId
        },
        select: {
          id: true
        }
      });

      if (!routine) {
        return null;
      }

      const aggregate = await tx.routineExercise.aggregate({
        where: {
          routineId
        },
        _max: {
          orderNo: true
        }
      });
      const orderNo = (aggregate._max.orderNo ?? 0) + 1;

      const routineExercise = await tx.routineExercise.create({
        data: {
          routineId,
          exerciseId: row.exerciseId,
          orderNo,
          metricType: row.metricType,
          targetSets: row.targetSets,
          targetReps: row.targetReps,
          targetWeightKg: row.targetWeightKg,
          targetDurationSeconds: row.targetDurationSeconds,
          restSeconds: row.restSeconds,
          updatedAt: new Date()
        },
        select: {
          id: true
        }
      });

      if (row.setDetails.length > 0) {
        await tx.routineExerciseSet.createMany({
          data: row.setDetails.map((setDetail) => ({
            routineExerciseId: routineExercise.id,
            setNo: setDetail.setNo,
            targetWeightKg: setDetail.targetWeightKg,
            targetReps: setDetail.targetReps
          }))
        });
      }

      return routineExercise;
    });
  }

  async updateExerciseByRoutineIdAndExerciseIdAndUserId(
    routineId: string,
    routineExerciseId: string,
    userId: string,
    row: RoutineExerciseCreateRow
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const target = await tx.routineExercise.findFirst({
        where: {
          id: routineExerciseId,
          routineId,
          routine: {
            userId
          }
        },
        select: {
          id: true
        }
      });

      if (!target) {
        return false;
      }

      await tx.routineExercise.update({
        where: {
          id: target.id
        },
        data: {
          exerciseId: row.exerciseId,
          metricType: row.metricType,
          targetSets: row.targetSets,
          targetReps: row.targetReps,
          targetWeightKg: row.targetWeightKg,
          targetDurationSeconds: row.targetDurationSeconds,
          restSeconds: row.restSeconds,
          updatedAt: new Date()
        }
      });

      await tx.routineExerciseSet.deleteMany({
        where: {
          routineExerciseId: target.id
        }
      });

      if (row.setDetails.length > 0) {
        await tx.routineExerciseSet.createMany({
          data: row.setDetails.map((setDetail) => ({
            routineExerciseId: target.id,
            setNo: setDetail.setNo,
            targetWeightKg: setDetail.targetWeightKg,
            targetReps: setDetail.targetReps
          }))
        });
      }

      return true;
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

  async deleteExerciseByRoutineIdAndExerciseIdAndUserId(
    routineId: string,
    routineExerciseId: string,
    userId: string
  ): Promise<boolean> {
    const result = await this.prisma.routineExercise.deleteMany({
      where: {
        id: routineExerciseId,
        routineId,
        routine: {
          userId
        }
      }
    });

    return result.count > 0;
  }

  async deleteExerciseByRoutineIdAndExerciseCodeAndUserId(
    routineId: string,
    exerciseCode: string,
    userId: string
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const target = await tx.routineExercise.findFirst({
        where: {
          routineId,
          routine: {
            userId
          },
          exercise: {
            code: exerciseCode
          }
        },
        orderBy: {
          orderNo: 'asc'
        },
        select: {
          id: true
        }
      });

      if (!target) {
        return false;
      }

      const result = await tx.routineExercise.deleteMany({
        where: {
          id: target.id,
          routineId,
          routine: {
            userId
          }
        }
      });

      return result.count > 0;
    });
  }
}
