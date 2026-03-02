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
  const username = process.env.POSTGRESQL_USERNAME?.trim();
  const password = process.env.POSTGRESQL_PASSWORD?.trim();
  const host = process.env.POSTGRESQL_HOST?.trim();
  const database = process.env.POSTGRESQL_DB?.trim();
  const rawPort = process.env.POSTGRESQL_PORT?.trim();
  const port = Number(rawPort ?? 5432);

  if (!username || !password || !host || !database) {
    const missingVars: string[] = [];
    if (!username) missingVars.push('POSTGRESQL_USERNAME');
    if (!password) missingVars.push('POSTGRESQL_PASSWORD');
    if (!host) missingVars.push('POSTGRESQL_HOST');
    if (!database) missingVars.push('POSTGRESQL_DB');
    throw new Error(
      `Missing required PostgreSQL environment variables: ${missingVars.join(', ')}`
    );
  }

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('POSTGRESQL_PORT must be a valid port number between 1 and 65535');
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

  const schema = (process.env.POSTGRESQL_SCHEMA ?? 'public').trim();
  if (schema.length > 0) {
    url.searchParams.set('schema', schema);
  }

  return url.toString();
}
