# Local Development Setup Guide

## Prerequisites

- **Docker** (version 20.10+): [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (version 1.29+): Usually included with Docker Desktop
- **Git**: For cloning the repository
- **Node.js 20+** (optional, for local development without Docker)

Verify installations:
```bash
docker --version
docker-compose --version
node --version
```

## Quick Start (Docker)

### 1. Clone and Navigate to Project
```bash
git clone <repository-url>
cd nairobi-sculpt
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

### 3. Start Services with Docker Compose
```bash
docker-compose up -d
```

This will:
- ✅ Start PostgreSQL database (port 5432)
- ✅ Start Redis cache (port 6379)
- ✅ Start NestJS API (port 3000)
- ✅ Start React web app (port 5173)
- ✅ Start PgAdmin (port 5050)

### 4. Run Database Migrations
```bash
# Access API container
docker-compose exec api bash

# Inside container:
pnpm exec prisma migrate dev
pnpm exec prisma db seed
```

### 5. Access the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| **Web App** | http://localhost:5173 | Use signup |
| **API** | http://localhost:3000/api | See docs at `/api` |
| **PgAdmin** | http://localhost:5050 | admin@nairobi-sculpt.local / admin |

## Services Overview

### PostgreSQL Database
- **Container**: `nairobi-sculpt-db`
- **Port**: 5432
- **User**: `nairobi_dev`
- **Password**: `dev_password_secure_123`
- **Database**: `nairobi_sculpt_dev`
- **Data Volume**: `postgres_data` (persisted)

### Redis Cache
- **Container**: `nairobi-sculpt-cache`
- **Port**: 6379
- **Purpose**: Session storage, caching
- **Data Volume**: `redis_data` (persisted)

### NestJS API
- **Container**: `nairobi-sculpt-api`
- **Port**: 3000
- **Hot Reload**: Enabled (watches `apps/api/src`)
- **Environment**: Development with debug logging

### React Web App
- **Container**: `nairobi-sculpt-web`
- **Port**: 5173
- **Hot Reload**: Enabled (Vite HMR)
- **Environment**: Development

### PgAdmin
- **Container**: `nairobi-sculpt-pgadmin`
- **Port**: 5050
- **Email**: admin@nairobi-sculpt.local
- **Password**: admin
- **Purpose**: Visual database management

## Common Commands

### Start/Stop Services
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgres
```

### Database Operations
```bash
# Access database shell
docker-compose exec postgres psql -U nairobi_dev -d nairobi_sculpt_dev

# Create migration
docker-compose exec api pnpm exec prisma migrate dev --name <migration-name>

# Seed database
docker-compose exec api pnpm exec prisma db seed

# View Prisma Studio
docker-compose exec api pnpm exec prisma studio
```

### API Development
```bash
# Access API container
docker-compose exec api bash

# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov

# Build
pnpm build

# Start production build
pnpm start:prod
```

### Web Development
```bash
# Access web container
docker-compose exec web bash

# Run tests
pnpm test

# Build
pnpm build

# Type check
pnpm type-check
```

### Restart Services
```bash
# Restart API
docker-compose restart api

# Restart web
docker-compose restart web

# Restart all
docker-compose restart
```

## Database Access

### Via PgAdmin Web Interface
1. Navigate to http://localhost:5050
2. Login: admin@nairobi-sculpt.local / admin
3. Add server:
   - **Name**: nairobi-sculpt-dev
   - **Host**: postgres
   - **Port**: 5432
   - **Username**: nairobi_dev
   - **Password**: dev_password_secure_123

### Via Command Line
```bash
docker-compose exec postgres psql -U nairobi_dev -d nairobi_sculpt_dev

# Common commands:
\dt                    # List tables
\d <table-name>       # Describe table
SELECT * FROM "User"; # Query data
\q                    # Quit
```

### Via Prisma Studio
```bash
docker-compose exec api pnpm exec prisma studio
```
Opens interactive database viewer at http://localhost:5555

## API Documentation

Once API is running, access:
- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json
- **Health Check**: http://localhost:3000/health

## Environment Variables

Key variables in `.env.local`:

```bash
# Database
DATABASE_URL=postgresql://nairobi_dev:dev_password_secure_123@localhost:5432/nairobi_sculpt_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev_jwt_secret_change_in_production
JWT_EXPIRES_IN=24h

# API
API_PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000/api
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Database Connection Fails
```bash
# Check if PostgreSQL is healthy
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Verify credentials
docker-compose exec postgres psql -U nairobi_dev -c "\l"
```

### Can't Access Services
```bash
# Check network
docker network ls
docker network inspect nairobi_nairobi-network

# Restart services
docker-compose down
docker-compose up -d
```

### Hot Reload Not Working
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Memory Issues
```bash
# Increase Docker memory in Docker Desktop settings
# Or limit container memory in docker-compose.yml:
services:
  api:
    mem_limit: 1g
```

## Development Workflow

### 1. Make Code Changes
- Edit files in `apps/api/src` or `apps/web/src`
- Services auto-reload (hot module replacement)

### 2. Create Database Migration
```bash
docker-compose exec api pnpm exec prisma migrate dev
```

### 3. Run Tests
```bash
# API tests
docker-compose exec api pnpm test

# Web tests
docker-compose exec web pnpm test
```

### 4. View Changes
- API: http://localhost:3000
- Web: http://localhost:5173

### 5. Commit & Push
```bash
git add .
git commit -m "feat: description"
git push origin feature-branch
```

## Production Considerations

⚠️ **IMPORTANT**: Change these for production:
- `JWT_SECRET` - Use strong random value
- `SMTP_PASSWORD` - Use environment-specific credentials
- `AWS_SECRET_ACCESS_KEY` - Secure credentials
- `Database password` - Strong password
- `Redis password` - If exposed to network

See [HARDENING_QUICK_REFERENCE.md](./HARDENING_QUICK_REFERENCE.md) for production setup.

## Next Steps

1. ✅ Start Docker services: `docker-compose up -d`
2. ✅ Run migrations: `docker-compose exec api pnpm exec prisma migrate dev`
3. ✅ Seed database: `docker-compose exec api pnpm exec prisma db seed`
4. ✅ Access web: http://localhost:5173
5. 🚀 Begin Phase 2 development

## Resources

- [Docker Documentation](https://docs.docker.com)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Project Architecture](./ARCHITECTURE.md)
- [RBAC Documentation](./RBAC_DOCUMENTATION_INDEX.md)

## Support

For issues, see:
- [SYSTEM_AUDIT_REPORT.md](./SYSTEM_AUDIT_REPORT.md)
- [DEVELOPMENT.md](./DEVELOPMENT.md)
- [CONTRIBUTING.md](./CONTRIBUTING.md)

---

**Last Updated**: January 16, 2026  
**Status**: Ready for Phase 2 Development ✅
