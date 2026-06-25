# syntax=docker/dockerfile:1
# Frontend (Next.js 16) — multi-stage, standalone output.
# Debian slim (not alpine) for painless sharp/native compat on both x86 and Oracle Ampere ARM.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* are inlined into the client bundle at build time, so they MUST be
# present here (passed as build args), not just at runtime.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_CAL_COM_LINK
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_SUPPORT_EMAIL
# Baked into the route manifest by rewrites(); points at the backend service on the compose network.
ARG BACKEND_INTERNAL_URL=http://backend:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_CAL_COM_LINK=$NEXT_PUBLIC_CAL_COM_LINK \
    NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID \
    NEXT_PUBLIC_SUPPORT_EMAIL=$NEXT_PUBLIC_SUPPORT_EMAIL \
    BACKEND_INTERNAL_URL=$BACKEND_INTERNAL_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nextjs

# Standalone server + the assets it does not bundle (static + public).
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
