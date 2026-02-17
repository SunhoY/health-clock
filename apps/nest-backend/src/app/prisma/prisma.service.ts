import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: resolveDatabaseUrl()
        }
      }
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

function resolveDatabaseUrl(): string {
  const explicitUrl = process.env.DATABASE_URL?.trim();
  if (explicitUrl) {
    return explicitUrl;
  }

  const username = process.env.POSTGRESQL_USERNAME;
  const password = process.env.POSTGRESQL_PASSWORD;
  const host = process.env.POSTGRESQL_HOST;
  const database = process.env.POSTGRESQL_DB;
  const port = Number(process.env.POSTGRESQL_PORT ?? 5432);

  if (!username || !password || !host || !database) {
    return 'postgresql://postgres:postgres@localhost:5432/postgres';
  }

  const url = new URL(
    `postgresql://${encodeURIComponent(username)}:${encodeURIComponent(
      password
    )}@${host}:${port}/${database}`
  );

  const sslMode = (
    process.env.POSTGRESQL_SSL_MODE ??
    process.env.POSTGRESQL_SSLMODE ??
    'require'
  ).trim();
  if (sslMode.length > 0) {
    url.searchParams.set('sslmode', sslMode);
  }

  const channelBinding = process.env.POSTGRESQL_CHANNEL_BINDING;
  if (channelBinding && channelBinding.trim().length > 0) {
    url.searchParams.set('channel_binding', channelBinding);
  }

  return url.toString();
}
