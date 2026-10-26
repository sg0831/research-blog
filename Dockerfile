# syntax=docker/dockerfile:1.7

FROM node:24-bookworm-slim AS base

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable \
    && corepack prepare pnpm@11.9.0 --activate

WORKDIR /app
RUN chown node:node /app
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

FROM base AS dependencies
USER node
RUN pnpm install --frozen-lockfile

FROM dependencies AS development
COPY --chown=node:node . .
RUN mkdir -p /app/.astro
EXPOSE 4321
CMD ["sh", "docker/dev.sh"]

FROM dependencies AS build
ARG SITE_URL=http://localhost:8080
ARG BASE_PATH=/
ENV SITE_URL=$SITE_URL \
    BASE_PATH=$BASE_PATH
COPY --chown=node:node . .
RUN pnpm build

FROM nginx:1.29-alpine AS public
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
