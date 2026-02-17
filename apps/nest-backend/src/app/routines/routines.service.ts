import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  CreateRoutineRequestDto,
  CreateRoutineResponseDto
} from './dto/create-routine.dto';
import {
  RoutineExerciseSummaryDto,
  RoutineSummaryDto
} from './dto/routine-summary.dto';
import { RoutinesRepository } from './routines.repository';

interface RoutineExerciseSetCreateInput {
  setNo: number;
  targetWeightKg?: number;
  targetReps: number;
}

interface RoutineExerciseCreateInput {
  exerciseCode: string;
  metricType: 'set_based' | 'duration_based';
  targetSets?: number;
  targetReps?: number;
  targetWeightKg?: number;
  targetDurationSeconds?: number;
  restSeconds?: number;
  setDetails: RoutineExerciseSetCreateInput[];
}

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

  async createRoutineByUserId(
    userId: string,
    payload: CreateRoutineRequestDto
  ): Promise<CreateRoutineResponseDto> {
    const title = this.toRoutineTitle(payload?.title);
    const preparedExercises = this.toCreateRoutineExercises(payload?.exercises);
    const uniqueCodes = [...new Set(preparedExercises.map((exercise) => exercise.exerciseCode))];

    const exerciseRows = await this.routinesRepository.findExercisesByCodes(uniqueCodes);
    const exerciseIdByCode = new Map(
      exerciseRows.map((exercise) => [exercise.code, exercise.id])
    );

    const unknownCodes = uniqueCodes.filter((code) => !exerciseIdByCode.has(code));
    if (unknownCodes.length > 0) {
      throw new BadRequestException(
        `Unknown exerciseId values: ${unknownCodes.join(', ')}`
      );
    }

    const created = await this.routinesRepository.createByUserId(userId, {
      title,
      exercises: preparedExercises.map((exercise) => ({
        exerciseId: exerciseIdByCode.get(exercise.exerciseCode) as string,
        metricType: exercise.metricType,
        targetSets: exercise.targetSets,
        targetReps: exercise.targetReps,
        targetWeightKg: exercise.targetWeightKg,
        targetDurationSeconds: exercise.targetDurationSeconds,
        restSeconds: exercise.restSeconds,
        setDetails: exercise.setDetails
      }))
    });

    return {
      id: created.id,
      title: created.title,
      exerciseCount: created.exerciseCount,
      createdAt: this.toIsoString(created.createdAt),
      lastUsedAt: created.lastUsedAt ? this.toIsoString(created.lastUsedAt) : null
    };
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

  async deleteRoutineExerciseByUserId(
    routineId: string,
    routineExerciseId: string,
    userId: string
  ): Promise<void> {
    const deletedById =
      await this.routinesRepository.deleteExerciseByRoutineIdAndExerciseIdAndUserId(
        routineId,
        routineExerciseId,
        userId
      );

    if (deletedById) {
      return;
    }

    const deletedByExerciseCode =
      await this.routinesRepository.deleteExerciseByRoutineIdAndExerciseCodeAndUserId(
        routineId,
        routineExerciseId,
        userId
      );

    if (!deletedByExerciseCode) {
      throw new NotFoundException('Routine exercise not found.');
    }
  }

  private toCreateRoutineExercises(value: unknown): RoutineExerciseCreateInput[] {
    if (!Array.isArray(value) || value.length === 0) {
      throw new BadRequestException('exercises must include at least one item.');
    }

    return value.map((exercise, index) => this.toCreateRoutineExercise(exercise, index));
  }

  private toCreateRoutineExercise(
    value: unknown,
    index: number
  ): RoutineExerciseCreateInput {
    if (!this.isRecord(value)) {
      throw new BadRequestException(`exercises[${index}] must be an object.`);
    }

    const exerciseCode = this.toString(value.exerciseId);
    if (!exerciseCode) {
      throw new BadRequestException(`exercises[${index}].exerciseId is required.`);
    }

    const restSeconds = this.readOptionalNonNegativeInt(
      value.restTime,
      `exercises[${index}].restTime`
    );
    const durationMinutes = this.readOptionalPositiveInt(
      value.duration,
      `exercises[${index}].duration`
    );

    if (durationMinutes !== undefined) {
      return {
        exerciseCode,
        metricType: 'duration_based',
        targetDurationSeconds: durationMinutes * 60,
        restSeconds: restSeconds ?? 60,
        setDetails: []
      };
    }

    const setCount = this.readRequiredPositiveInt(
      value.sets,
      `exercises[${index}].sets`
    );
    const targetWeightKg = this.readOptionalNonNegativeNumber(
      value.weight,
      `exercises[${index}].weight`
    );
    const targetReps = this.readOptionalPositiveInt(
      value.reps,
      `exercises[${index}].reps`
    );
    const setDetails = this.toStrengthSetDetails({
      rawValue: value.setDetails,
      setCount,
      fallbackWeight: targetWeightKg,
      fallbackReps: targetReps,
      exerciseIndex: index
    });

    return {
      exerciseCode,
      metricType: 'set_based',
      targetSets: setCount,
      targetReps,
      targetWeightKg,
      restSeconds: restSeconds ?? 60,
      setDetails
    };
  }

  private toStrengthSetDetails({
    rawValue,
    setCount,
    fallbackWeight,
    fallbackReps,
    exerciseIndex
  }: {
    rawValue: unknown;
    setCount: number;
    fallbackWeight?: number;
    fallbackReps?: number;
    exerciseIndex: number;
  }): RoutineExerciseSetCreateInput[] {
    if (!Array.isArray(rawValue)) {
      if (fallbackReps === undefined) {
        throw new BadRequestException(
          `exercises[${exerciseIndex}].reps is required for strength exercises.`
        );
      }

      return Array.from({ length: setCount }, (_, offset) => ({
        setNo: offset + 1,
        targetWeightKg: fallbackWeight,
        targetReps: fallbackReps
      }));
    }

    const mapBySetNo = new Map<number, { weight?: number; reps?: number }>();

    rawValue.forEach((setValue, setIndex) => {
      if (!this.isRecord(setValue)) {
        throw new BadRequestException(
          `exercises[${exerciseIndex}].setDetails[${setIndex}] must be an object.`
        );
      }

      const setNo = this.readRequiredPositiveInt(
        setValue.setNumber,
        `exercises[${exerciseIndex}].setDetails[${setIndex}].setNumber`
      );

      if (setNo > setCount) {
        return;
      }

      mapBySetNo.set(setNo, {
        weight: this.readOptionalNonNegativeNumber(
          setValue.weight,
          `exercises[${exerciseIndex}].setDetails[${setIndex}].weight`
        ),
        reps: this.readOptionalPositiveInt(
          setValue.reps,
          `exercises[${exerciseIndex}].setDetails[${setIndex}].reps`
        )
      });
    });

    return Array.from({ length: setCount }, (_, offset) => {
      const setNo = offset + 1;
      const setData = mapBySetNo.get(setNo);
      const targetReps = setData?.reps ?? fallbackReps;
      if (targetReps === undefined) {
        throw new BadRequestException(
          `exercises[${exerciseIndex}].setDetails requires reps for set ${setNo}.`
        );
      }

      return {
        setNo,
        targetWeightKg: setData?.weight ?? fallbackWeight,
        targetReps
      };
    });
  }

  private toRoutineTitle(value: unknown): string {
    const title = this.toString(value)?.trim();
    if (!title) {
      throw new BadRequestException('title is required.');
    }

    return title;
  }

  private readRequiredPositiveInt(value: unknown, fieldName: string): number {
    const parsed = this.toInt(value);
    if (!parsed || parsed <= 0) {
      throw new BadRequestException(`${fieldName} must be a positive integer.`);
    }

    return parsed;
  }

  private readOptionalPositiveInt(value: unknown, fieldName: string): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    const parsed = this.toInt(value);
    if (parsed === undefined) {
      return undefined;
    }

    if (parsed <= 0) {
      throw new BadRequestException(`${fieldName} must be a positive integer.`);
    }

    return parsed;
  }

  private readOptionalNonNegativeInt(
    value: unknown,
    fieldName: string
  ): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    const parsed = this.toInt(value);
    if (parsed === undefined) {
      return undefined;
    }

    if (parsed < 0) {
      throw new BadRequestException(`${fieldName} must be a non-negative integer.`);
    }

    return parsed;
  }

  private readOptionalNonNegativeNumber(
    value: unknown,
    fieldName: string
  ): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    const parsed = this.toNumber(value);
    if (parsed === undefined) {
      return undefined;
    }

    if (parsed < 0) {
      throw new BadRequestException(`${fieldName} must be a non-negative number.`);
    }

    return parsed;
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
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return undefined;
      }

      const parsed = Number(trimmed);
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
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return undefined;
      }

      const parsed = Number(trimmed);
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
