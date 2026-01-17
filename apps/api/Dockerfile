# NestJS API Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy monorepo files from root context
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Generate Prisma client
RUN cd apps/api && pnpm exec prisma generate

# Expose port
EXPOSE 3000

# Start in development mode from api directory
WORKDIR /app/apps/api
CMD ["pnpm", "start:dev"]
