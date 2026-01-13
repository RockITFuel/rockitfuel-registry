# RockITFuel Registry - Dockerfile for Coolify/Dokploy deployment
# Using Node.js for compatibility with servers lacking AVX CPU support

# ============================================================================
# Base stage - Node.js runtime
# ============================================================================
FROM node:20-alpine AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# ============================================================================
# Dependencies stage - Install node_modules
# ============================================================================
FROM base AS deps

# Copy package files
COPY package.json ./

# Install dependencies using pnpm (generates its own lockfile)
RUN pnpm install

# ============================================================================
# Builder stage - Build the application
# ============================================================================
FROM base AS builder

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the registry JSON files
RUN node scripts/build-registry.mjs

# Build the SolidStart application
RUN pnpm run build

# ============================================================================
# Runner stage - Production image
# ============================================================================
FROM node:20-alpine AS runner
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
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]
