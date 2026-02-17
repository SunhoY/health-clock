import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BodyPartDto } from './dto/body-part.dto';
import { CreateBodyPartRequestDto } from './dto/create-body-part.dto';
import { BodyPartExerciseDto } from './dto/body-part-exercise.dto';
import { CreateBodyPartExerciseRequestDto } from './dto/create-body-part-exercise.dto';
import {
  BodyPartCreateRow,
  ExerciseCreateRow,
  BodyPartSeedRow,
  ExercisesRepository
} from './exercises.repository';

const DEFAULT_BODY_PARTS: BodyPartSeedRow[] = [
  { id: 'chest', name: '가슴', sortOrder: 10 },
  { id: 'back', name: '등', sortOrder: 20 },
  { id: 'legs', name: '하체', sortOrder: 30 },
  { id: 'shoulders', name: '어깨', sortOrder: 40 },
  { id: 'arms', name: '팔', sortOrder: 50 },
  { id: 'abs', name: '코어(복부)', sortOrder: 60 },
  { id: 'calves', name: '종아리', sortOrder: 70 },
  { id: 'fullbody', name: '전신', sortOrder: 80 },
  { id: 'cardio', name: '유산소', sortOrder: 90 }
];

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesRepository: ExercisesRepository) {}

  async getBodyParts(): Promise<BodyPartDto[]> {
    await this.exercisesRepository.ensureDefaultBodyParts(DEFAULT_BODY_PARTS);
    const rows = await this.exercisesRepository.findActiveBodyParts();

    return rows.map((row) => ({
      id: row.id,
      name: row.name
    }));
  }

  async createBodyPart(payload: CreateBodyPartRequestDto): Promise<BodyPartDto> {
    await this.exercisesRepository.ensureDefaultBodyParts(DEFAULT_BODY_PARTS);
    const row = this.toBodyPartCreateRow(payload);

    const alreadyExists = await this.exercisesRepository.existsByIdOrName(
      row.id,
      row.name
    );
    if (alreadyExists) {
      throw new ConflictException('Body part already exists.');
    }

    const created = await this.exercisesRepository.createBodyPart(row);
    return {
      id: created.id,
      name: created.name
    };
  }

  async getExercisesByBodyPartId(
    bodyPartIdRaw: string
  ): Promise<BodyPartExerciseDto[]> {
    const bodyPartId = this.toBodyPartId(bodyPartIdRaw);
    await this.ensureBodyPartExists(bodyPartId);
    const rows = await this.exercisesRepository.findActiveExercisesByBodyPart(
      bodyPartId
    );

    return rows.map((row) => this.toBodyPartExerciseDto(row));
  }

  async createExerciseByBodyPartId(
    bodyPartIdRaw: string,
    payload: CreateBodyPartExerciseRequestDto
  ): Promise<BodyPartExerciseDto> {
    const bodyPartId = this.toBodyPartId(bodyPartIdRaw);
    await this.ensureBodyPartExists(bodyPartId);

    const row: ExerciseCreateRow = {
      code: this.toExerciseCode(payload?.code),
      name: this.toExerciseName(payload?.name),
      bodyPart: bodyPartId,
      exerciseType: this.toExerciseType(payload?.exerciseType),
      equipment: this.toExerciseEquipment(payload?.equipment),
      difficulty: this.toDifficulty(payload?.difficulty)
    };

    try {
      const created = await this.exercisesRepository.createExercise(row);
      return this.toBodyPartExerciseDto(created);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Exercise code already exists.');
      }

      throw error;
    }
  }

  async deleteExerciseByCode(exerciseCodeRaw: string): Promise<void> {
    const exerciseCode = this.toExerciseCode(exerciseCodeRaw);
    const deactivated = await this.exercisesRepository.deactivateExerciseByCode(
      exerciseCode
    );

    if (!deactivated) {
      throw new NotFoundException('Exercise not found.');
    }
  }

  private toBodyPartCreateRow(payload: CreateBodyPartRequestDto): BodyPartCreateRow {
    return {
      id: this.toBodyPartId(payload?.id),
      name: this.toBodyPartName(payload?.name),
      sortOrder: this.toSortOrder(payload?.sortOrder),
      isActive: this.toIsActive(payload?.isActive)
    };
  }

  private toBodyPartId(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('id is required.');
    }

    const normalized = value.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(normalized)) {
      throw new BadRequestException(
        'id must contain only lowercase letters, numbers, and hyphens.'
      );
    }

    return normalized;
  }

  private toBodyPartName(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('name is required.');
    }

    const normalized = value.trim();
    if (!normalized) {
      throw new BadRequestException('name is required.');
    }

    return normalized;
  }

  private toSortOrder(value: unknown): number | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new BadRequestException('sortOrder must be a positive integer.');
    }

    const normalized = Math.trunc(value);
    if (normalized <= 0) {
      throw new BadRequestException('sortOrder must be a positive integer.');
    }

    return normalized;
  }

  private toIsActive(value: unknown): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value !== 'boolean') {
      throw new BadRequestException('isActive must be a boolean value.');
    }

    return value;
  }

  private async ensureBodyPartExists(bodyPartId: string): Promise<void> {
    await this.exercisesRepository.ensureDefaultBodyParts(DEFAULT_BODY_PARTS);
    const bodyPart =
      await this.exercisesRepository.findActiveBodyPartById(bodyPartId);
    if (!bodyPart) {
      throw new NotFoundException('Body part not found.');
    }
  }

  private toExerciseCode(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('code is required.');
    }

    const normalized = value.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(normalized)) {
      throw new BadRequestException(
        'code must contain only lowercase letters, numbers, and hyphens.'
      );
    }

    return normalized;
  }

  private toExerciseName(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('name is required.');
    }

    const normalized = value.trim();
    if (!normalized) {
      throw new BadRequestException('name is required.');
    }

    return normalized;
  }

  private toExerciseType(value: unknown): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('exerciseType is required.');
    }

    const normalized = value.trim().toLowerCase();
    if (normalized !== 'strength' && normalized !== 'cardio') {
      throw new BadRequestException(
        'exerciseType must be one of: strength, cardio.'
      );
    }

    return normalized;
  }

  private toExerciseEquipment(value: unknown): string[] {
    if (value === null || value === undefined) {
      return [];
    }

    if (!Array.isArray(value)) {
      throw new BadRequestException('equipment must be an array of strings.');
    }

    return value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  private toDifficulty(
    value: unknown
  ): 'beginner' | 'intermediate' | 'advanced' | undefined {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('difficulty must be a string value.');
    }

    const normalized = value.trim().toLowerCase();
    if (
      normalized !== 'beginner' &&
      normalized !== 'intermediate' &&
      normalized !== 'advanced'
    ) {
      throw new BadRequestException(
        'difficulty must be one of: beginner, intermediate, advanced.'
      );
    }

    return normalized;
  }

  private toBodyPartExerciseDto(value: {
    code: string;
    name: string;
    bodyPart: string;
    exerciseType: string;
    equipment: string[];
    difficulty: string | null;
  }): BodyPartExerciseDto {
    return {
      code: value.code,
      name: value.name,
      bodyPart: value.bodyPart,
      exerciseType: value.exerciseType,
      equipment: value.equipment,
      difficulty: this.normalizeDifficulty(value.difficulty)
    };
  }

  private normalizeDifficulty(
    value: string | null
  ): 'beginner' | 'intermediate' | 'advanced' | undefined {
    if (
      value === 'beginner' ||
      value === 'intermediate' ||
      value === 'advanced'
    ) {
      return value;
    }

    return undefined;
  }

}
