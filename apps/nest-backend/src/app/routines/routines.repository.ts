import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

interface RoutineSummaryRow {
  id: string;
  title: string;
  exerciseCount: number;
  createdAt: Date;
  lastUsedAt: Date | null;
}

@Injectable()
export class RoutinesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findSummariesByUserId(userId: string): Promise<RoutineSummaryRow[]> {
    const result = await this.databaseService.query<RoutineSummaryRow>(
      `
        SELECT
          routines.id,
          routines.title,
          COUNT(routine_exercises.id)::int AS "exerciseCount",
          routines.created_at AS "createdAt",
          routines.last_used_at AS "lastUsedAt"
        FROM routines
        LEFT JOIN routine_exercises
          ON routine_exercises.routine_id = routines.id
        WHERE routines.user_id = $1
        GROUP BY routines.id
        ORDER BY routines.created_at DESC
      `,
      [userId]
    );

    return result.rows;
  }
}
