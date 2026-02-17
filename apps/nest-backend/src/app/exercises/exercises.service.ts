import {
  BadRequestException,
  ConflictException,
  Injectable
} from '@nestjs/common';
import { BodyPartDto } from './dto/body-part.dto';
import { CreateBodyPartRequestDto } from './dto/create-body-part.dto';
import {
  BodyPartCreateRow,
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

    try {
      const created = await this.exercisesRepository.createBodyPart(row);
      return {
        id: created.id,
        name: created.name
      };
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Body part already exists.');
      }

      throw error;
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

  private isUniqueConstraintError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    return (
      'code' in error &&
      (error as {
        code?: unknown;
      }).code === 'P2002'
    );
  }
}
