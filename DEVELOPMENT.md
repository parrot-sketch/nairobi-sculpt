# Development Guide

## Quick Start for New Developers

Welcome to the Nairobi Sculpt development team! Follow these steps to get up and running.

### 1. Prerequisites
- Node.js 20+ ([download](https://nodejs.org/))
- pnpm 10.28+ (`npm install -g pnpm`)
- Git
- PostgreSQL 14+ (for backend development)
- VS Code or your preferred IDE

### 2. Clone & Setup

```bash
git clone <repository-url>
cd nairobi-sculpt

# Install dependencies
pnpm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Update .env files with your local settings
```

### 3. Database Setup

```bash
# Create database
createdb nairobi_sculpt

# Update DATABASE_URL in apps/api/.env
# DATABASE_URL="postgresql://user:password@localhost:5432/nairobi_sculpt"

# Generate Prisma client
pnpm --filter api prisma:generate

# Run migrations
pnpm --filter api prisma:migrate

# Seed with demo data
pnpm --filter api prisma:seed
```

### 4. Start Development

```bash
# Terminal 1: Start all apps
pnpm dev

# Or in separate terminals:
pnpm --filter web dev    # Frontend on http://localhost:5173
pnpm --filter api start:dev # Backend on http://localhost:3000

# Open http://localhost:5173 in your browser
```

### 5. Test Your Setup

```bash
# Login with demo credentials
Email: patient@nairobi-sculpt.com
Password: patient123

# Run tests to verify
pnpm test
```

## Code Style & Standards

### TypeScript
- Always use TypeScript for `.ts` and `.tsx` files
- Enable strict mode (already configured)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React
- Use functional components with hooks
- Extract components for reusability
- Use React Context for global state (auth)
- Use TanStack Query for server state
- Follow React best practices and hooks rules

### NestJS Backend
- Use decorators consistently (@Controller, @Post, etc.)
- Implement services for business logic
- Use Prisma for all database access
- Validate input with class-validator
- Handle errors gracefully with NestJS exceptions

### Styling
- Use TailwindCSS utility classes
- Follow Nairobi Sculpt brand color scheme
- Use responsive design (mobile-first approach)
- Maintain consistent spacing and typography

### Testing
- Write tests for business logic
- Use meaningful test descriptions
- Mock external dependencies
- Aim for 70%+ code coverage

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit with clear messages
git commit -m "feat: add user authentication"

# Push to remote
git push origin feature/feature-name

# Create Pull Request
# Wait for review and CI/CD checks
# Merge after approval
```

## Common Commands

```bash
# Development
pnpm dev              # Start all apps
pnpm --filter web dev # Frontend only
pnpm --filter api start:dev # Backend only

# Build
pnpm build                # Build all
pnpm --filter web build   # Frontend build
pnpm --filter api build   # Backend build

# Testing
pnpm test                 # Run all tests
pnpm --filter api test    # Backend tests
pnpm --filter web test    # Frontend tests
pnpm test:watch          # Watch mode

# Code Quality
pnpm lint                # Lint all code
pnpm format              # Format code
pnpm type-check         # Check TypeScript

# Database
pnpm --filter api prisma:migrate   # Run migrations
pnpm --filter api prisma:seed      # Seed data
pnpm --filter api prisma:studio    # Open Prisma Studio
```

## Project Structure Overview

### Frontend (`apps/web`)
- Components, pages, contexts, and routing
- TailwindCSS for styling
- React Router for navigation
- Jest & React Testing Library

### Backend (`apps/api`)
- NestJS controllers, services, modules
- Prisma ORM for database
- JWT authentication
- Role-based access control

### Shared (`packages/`)
- `ui/` - Reusable React components
- `config/` - Constants, colors, routes
- `utils/` - Helper functions

## Useful VS Code Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "orta.vscode-jest",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

## Debugging

### Frontend
1. Open DevTools (F12)
2. Set breakpoints in Sources tab
3. Use React DevTools browser extension
4. Check Console for errors

### Backend
```bash
# Run with debugging
pnpm --filter api start:debug

# Open chrome://inspect in Chrome
# Click on the node process to debug
```

## Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -i :3000    # Backend
lsof -i :5173    # Frontend

# Kill process
kill -9 <PID>
```

### Dependency issues
```bash
# Clean install
pnpm clean
pnpm install

# Clear turbo cache
pnpm clean
```

### Database connection issues
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
# Test connection
psql $DATABASE_URL
```

### Module not found
```bash
# Regenerate Prisma client
pnpm --filter api prisma:generate

# Rebuild packages
pnpm build
```

## Performance Tips

- Use `pnpm` instead of `npm` (faster)
- Enable Turborepo caching with `turbo.json`
- Use React Query for data fetching
- Lazy load routes with React.lazy()
- Profile bundle size with `pnpm build --report`

## Resources

- [NestJS Docs](https://docs.nestjs.com)
- [React Docs](https://react.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)

## Getting Help

1. Check documentation and README files
2. Search GitHub issues
3. Ask team members in discussion channels
4. Create an issue with details and reproducible steps

## Next Steps

1. Read the code in `apps/web` and `apps/api`
2. Create a feature branch and make a small change
3. Submit a Pull Request following the process above
4. Join the team discussions and contribute!

Happy coding! 🚀
