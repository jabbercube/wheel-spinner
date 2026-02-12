# Multi-stage Dockerfile for Wheel Spinner
# Supports development, test, and production builds

# ============================================
# Development stage - for live development
# ============================================
FROM node:18-alpine AS development

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code (will be overridden by volume mount in dev)
COPY . .

# Set environment for webpack
ENV NODE_OPTIONS=--openssl-legacy-provider

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# ============================================
# Builder stage - builds the application
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Set environment for webpack build
ENV NODE_OPTIONS=--openssl-legacy-provider

# Build argument to determine which build to run (dev, test, or prod)
ARG BUILD_ENV=prod
RUN npm run build:${BUILD_ENV}

# ============================================
# Production stage - minimal runtime image
# ============================================
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend

# Create data directory for SQLite database
RUN mkdir -p /app/backend/data

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "backend/server.js"]
