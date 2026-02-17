import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface BodyPartRow {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

export interface BodyPartSeedRow {
  id: string;
  name: string;
  sortOrder: number;
}

export interface BodyPartCreateRow {
  id: string;
  name: string;
  sortOrder?: number;
  isActive: boolean;
}

@Injectable()
export class ExercisesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ensureDefaultBodyParts(rows: BodyPartSeedRow[]): Promise<void> {
    if (rows.length === 0) {
      return;
    }

    await this.ensureBodyPartTable();
    await this.prisma.$transaction(
      rows.map((row) =>
        this.prisma.$executeRawUnsafe(
          `
            INSERT INTO body_parts (id, name, sort_order, is_active)
            VALUES ($1, $2, $3, true)
            ON CONFLICT (id) DO NOTHING
          `,
          row.id,
          row.name,
          row.sortOrder
        )
      )
    );
  }

  async findActiveBodyParts(): Promise<BodyPartRow[]> {
    await this.ensureBodyPartTable();

    return this.prisma.$queryRawUnsafe<BodyPartRow[]>(`
      SELECT
        id,
        name,
        sort_order AS "sortOrder",
        is_active AS "isActive",
        created_at AS "createdAt"
      FROM body_parts
      WHERE is_active = true
      ORDER BY sort_order ASC, created_at ASC
    `);
  }

  async existsByIdOrName(id: string, name: string): Promise<boolean> {
    await this.ensureBodyPartTable();

    const rows = await this.prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `
        SELECT id
        FROM body_parts
        WHERE id = $1 OR name = $2
        LIMIT 1
      `,
      id,
      name
    );

    return rows.length > 0;
  }

  async createBodyPart(row: BodyPartCreateRow): Promise<BodyPartRow> {
    await this.ensureBodyPartTable();
    const sortOrder = row.sortOrder ?? (await this.getNextSortOrder());
    const rows = await this.prisma.$queryRawUnsafe<BodyPartRow[]>(
      `
        INSERT INTO body_parts (id, name, sort_order, is_active)
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          name,
          sort_order AS "sortOrder",
          is_active AS "isActive",
          created_at AS "createdAt"
      `,
      row.id,
      row.name,
      sortOrder,
      row.isActive
    );

    return rows[0];
  }

  private async getNextSortOrder(): Promise<number> {
    const rows = await this.prisma.$queryRawUnsafe<Array<{ nextSortOrder: number }>>(
      `
        SELECT COALESCE(MAX(sort_order), 0) + 10 AS "nextSortOrder"
        FROM body_parts
      `
    );

    return Number(rows[0]?.nextSortOrder ?? 10);
  }

  private async ensureBodyPartTable(): Promise<void> {
    await this.prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS body_parts (
        id VARCHAR(30) PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        sort_order INTEGER NOT NULL DEFAULT 1000 CHECK (sort_order > 0),
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await this.prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS idx_body_parts_is_active_sort_order
      ON body_parts(is_active, sort_order)
    `);
  }
}
