# RockITFuel Registry - Dockerfile for Coolify/Dokploy deployment
# Multi-stage build for optimized production image

# ============================================================================
# Base stage - Bun runtime
# ============================================================================
FROM oven/bun:1 AS base
WORKDIR /app

# ============================================================================
# Dependencies stage - Install node_modules
# ============================================================================
FROM base AS deps

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# ============================================================================
# Builder stage - Build the application
# ============================================================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the registry JSON files
RUN bun run build:registry

# Build the SolidStart application
RUN bun run build

# ============================================================================
# Runner stage - Production image
# ============================================================================
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copy built output
COPY --from=builder /app/.output ./.output

# Copy public directory (contains registry JSON files)
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["bun", "run", ".output/server/index.mjs"]
