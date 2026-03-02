# syntax=docker/dockerfile:1.7

FROM node:24-bookworm-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

WORKDIR /workspace

RUN corepack enable
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Copy only files required for dependency installation first (better layer cache).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json tsconfig.base.json tsconfig.json ./
COPY apps/nest-backend/package.json apps/nest-backend/package.json
COPY apps/nest-backend/webpack.config.js apps/nest-backend/webpack.config.js
COPY apps/nest-backend/tsconfig.json apps/nest-backend/tsconfig.json
COPY apps/nest-backend/tsconfig.app.json apps/nest-backend/tsconfig.app.json
COPY prisma/schema.prisma prisma/schema.prisma

RUN pnpm install --frozen-lockfile

COPY apps/nest-backend apps/nest-backend
COPY prisma prisma

# Build backend bundle and prepare runnable dist contents only.
RUN pnpm nx run @health-clock/nest-backend:build:production --skipSync \
  && mkdir -p /tmp/runtime \
  && cp -R apps/nest-backend/dist/. /tmp/runtime/ \
  && cd /tmp/runtime \
  && pnpm install --prod --frozen-lockfile --ignore-scripts --config.confirmModulesPurge=false \
  && pnpm dlx prisma@6.16.2 generate --schema ./prisma/schema.prisma

FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /tmp/runtime/ ./

EXPOSE 3000

CMD ["node", "main.js"]
