import { Injectable } from '@nestjs/common';
import { RoutineSummaryDto } from './dto/routine-summary.dto';
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
      createdAt: this.toIsoString(row.createdAt),
      lastUsedAt: row.lastUsedAt ? this.toIsoString(row.lastUsedAt) : null
    }));
  }

  private toIsoString(value: Date | string): string {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return new Date(value).toISOString();
  }
}
