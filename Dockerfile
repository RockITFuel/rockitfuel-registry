# RockITFuel Registry - Dockerfile for Coolify/Dokploy deployment
# Hybrid build: Node.js for compilation (AVX-safe), Bun for runtime

# ============================================================================
# Dependencies stage - Install with Bun (fast)
# ============================================================================
FROM oven/bun:debian AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ============================================================================
# Builder stage - Build with Node.js (AVX-compatible)
# Bun's Vite integration crashes on CPUs without AVX during build
# ============================================================================
FROM node:20-slim AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build registry JSON files
RUN node scripts/build-registry.mjs

# Build SolidStart application
RUN npm run build

# ============================================================================
# Runner stage - Run with Bun (fast runtime)
# ============================================================================
FROM oven/bun:debian AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Install curl for health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy built output
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["bun", "run", ".output/server/index.mjs"]
