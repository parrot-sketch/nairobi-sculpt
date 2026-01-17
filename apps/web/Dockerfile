# React + Vite Web Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy monorepo files from root context
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Expose port
EXPOSE 5173

# Start dev server from web directory
WORKDIR /app/apps/web
CMD ["pnpm", "dev"]
