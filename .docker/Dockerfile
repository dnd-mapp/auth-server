FROM --platform=$BUILDPLATFORM node:24.14.0 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


FROM base AS builder

COPY package.json pnpm-*.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV="production"

RUN pnpm build


FROM base AS packager

COPY --from=builder /app/dist/auth-server .

ENV NODE_ENV="production"

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install


FROM node:24.14.0-alpine3.23

ENV NODE_ENV="production"
ENV AUTH_SERVER_HOST="0.0.0.0"

WORKDIR /app

COPY --from=packager /app .

EXPOSE 4350

CMD ["node", "/app/main.js"]
