import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

    await this.prisma.$transaction(
      rows.map((row) =>
        this.prisma.bodyPart.upsert({
          where: {
            id: row.id
          },
          update: {},
          create: {
            id: row.id,
            name: row.name,
            sortOrder: row.sortOrder,
            isActive: true
          }
        })
      )
    );
  }

  async findActiveBodyParts(): Promise<BodyPartRow[]> {
    return this.prisma.bodyPart.findMany({
      where: {
        isActive: true
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }]
    });
  }

  async createBodyPart(row: BodyPartCreateRow): Promise<BodyPartRow> {
    return this.prisma.$transaction(async (tx) => {
      const sortOrder = row.sortOrder ?? (await this.getNextSortOrder(tx));

      return tx.bodyPart.create({
        data: {
          id: row.id,
          name: row.name,
          sortOrder,
          isActive: row.isActive
        }
      });
    });
  }

  private async getNextSortOrder(client: Prisma.TransactionClient): Promise<number> {
    const aggregate = await client.bodyPart.aggregate({
      _max: {
        sortOrder: true
      }
    });

    return (aggregate._max.sortOrder ?? 0) + 10;
  }
}
