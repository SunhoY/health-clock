import { Injectable, NotFoundException } from '@nestjs/common';
import {
  RoutineExerciseSummaryDto,
  RoutineSummaryDto
} from './dto/routine-summary.dto';
import { RoutinesRepository } from './routines.repository';

@Injectable()
export class RoutinesService {
  constructor(private readonly routinesRepository: RoutinesRepository) {}

  async getRoutineSummariesByUserId(userId: string): Promise<RoutineSummaryDto[]> {
    const rows = await this.routinesRepository.findSummariesByUserId(userId);

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      exerciseCount: row.exerciseCount,
      exercises: this.toRoutineExercises(row.exercises),
      createdAt: this.toIsoString(row.createdAt),
      lastUsedAt: row.lastUsedAt ? this.toIsoString(row.lastUsedAt) : null
    }));
  }

  async deleteRoutineByUserId(routineId: string, userId: string): Promise<void> {
    const deleted = await this.routinesRepository.deleteByRoutineIdAndUserId(
      routineId,
      userId
    );

    if (!deleted) {
      throw new NotFoundException('Routine not found.');
    }
  }

  private toRoutineExercises(value: unknown): RoutineExerciseSummaryDto[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => this.toRoutineExercise(item))
      .filter((item): item is RoutineExerciseSummaryDto => item !== null);
  }

  private toRoutineExercise(value: unknown): RoutineExerciseSummaryDto | null {
    if (!this.isRecord(value)) {
      return null;
    }

    const id = this.toString(value.id);
    const part = this.toString(value.part);
    const name = this.toString(value.name);

    if (!id || !part || !name) {
      return null;
    }

    const sets = this.toInt(value.sets) ?? 1;

    return {
      id,
      part,
      name,
      sets,
      weight: this.toNumber(value.weight),
      reps: this.toInt(value.reps),
      duration: this.toInt(value.duration)
    };
  }

  private toIsoString(value: Date | string): string {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return new Date(value).toISOString();
  }

  private toString(value: unknown): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
  }

  private toInt(value: unknown): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.trunc(value);
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return Math.trunc(parsed);
      }
    }

    return undefined;
  }

  private toNumber(value: unknown): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
