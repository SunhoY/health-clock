import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  Pool,
  type PoolClient,
  type PoolConfig,
  type QueryResult,
  type QueryResultRow
} from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: Pool | null = null;

  async query<T extends QueryResultRow>(
    text: string,
    params: readonly unknown[] = []
  ): Promise<QueryResult<T>> {
    return this.getPool().query<T>(text, params);
  }

  async withTransaction<T>(
    handler: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getPool().connect();

    try {
      await client.query('BEGIN');
      const result = await handler(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.pool) {
      return;
    }

    await this.pool.end();
    this.pool = null;
  }

  private getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool(this.buildPoolConfig());
    }

    return this.pool;
  }

  private buildPoolConfig(): PoolConfig {
    const sslMode = (
      process.env.POSTGRESQL_SSL_MODE ?? process.env.POSTGRESQL_SSLMODE ?? 'require'
    ).toLowerCase();
    const shouldUseSsl = sslMode === 'require';

    return {
      host: process.env.POSTGRESQL_HOST,
      port: Number(process.env.POSTGRESQL_PORT ?? 5432),
      database: process.env.POSTGRESQL_DB,
      user: process.env.POSTGRESQL_USERNAME,
      password: process.env.POSTGRESQL_PASSWORD,
      ssl: shouldUseSsl ? {} : undefined,
      enableChannelBinding: this.parseBoolean(
        process.env.POSTGRESQL_ENABLE_CHANNEL_BINDING,
        false
      )
    };
  }

  private parseBoolean(raw: string | undefined, fallback: boolean): boolean {
    if (raw === undefined) {
      return fallback;
    }

    if (raw.toLowerCase() === 'true') {
      return true;
    }

    if (raw.toLowerCase() === 'false') {
      return false;
    }

    return fallback;
  }
}
