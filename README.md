# Nairobi Sculpt - Aesthetic Surgery Management System

Production-ready monorepo for managing aesthetic surgery appointments, medical records, and patient interactions.

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling with custom Nairobi Sculpt branding
- **React Router** for navigation
- **TanStack Query** for data fetching and caching
- **Jest** & **React Testing Library** for testing

### Backend
- **NestJS** framework with TypeScript
- **PostgreSQL** database
- **Prisma** ORM for type-safe database access
- **JWT** authentication with role-based access control
- **HIPAA-compliant logging** with audit trail

### DevOps & Tooling
- **pnpm** monorepo package manager
- **Turborepo** for build optimization
- **GitHub Actions** for CI/CD
- **Vercel** deployment for frontend
- **Railway** deployment for backend (optional)

## Project Structure

```
nairobi-sculpt/
├── apps/
│   ├── web/                 # Frontend React application
│   └── api/                 # Backend NestJS API
├── packages/
│   ├── ui/                  # Shared React components
│   ├── config/              # Shared configuration and constants
│   └── utils/               # Shared utility functions
├── .github/
│   └── workflows/           # CI/CD pipelines
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
└── package.json            # Root package configuration
```

## User Roles

The system supports four main user roles with different access levels:

1. **PATIENT** - Can view appointments, medical records, and billing
2. **DOCTOR** - Can manage appointments, view patient records, and create procedures
3. **FRONTDESK** - Can schedule appointments and manage patient check-ins
4. **ADMIN** - Full system access including user management and analytics

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 10.28+
- PostgreSQL 14+ (for backend)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Configure PostgreSQL connection in apps/api/.env
# Update VITE_API_URL in apps/web/.env
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Frontend runs on: http://localhost:5173
# Backend runs on: http://localhost:3000

# Specific apps
pnpm --filter web dev      # Frontend only
pnpm --filter api start:dev # Backend only
```

### Database

```bash
# Generate Prisma client
pnpm --filter api prisma:generate

# Create/migrate database
pnpm --filter api prisma:migrate

# Seed with demo data
pnpm --filter api prisma:seed

# Open Prisma Studio
pnpm --filter api prisma:studio
```

### Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm --filter api test:e2e
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter web build
pnpm --filter api build
```

### Linting & Formatting

```bash
# Lint all files
pnpm lint

# Format all files
pnpm format

# Type check
pnpm type-check
```

## Demo Credentials

After seeding the database, use these credentials to test:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@nairobi-sculpt.com | admin123 |
| Doctor | doctor@nairobi-sculpt.com | doctor123 |
| Patient | patient@nairobi-sculpt.com | patient123 |
| Frontdesk | frontdesk@nairobi-sculpt.com | frontdesk123 |

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### More endpoints coming soon...

## Branding

### Colors
- **Primary Purple**: #8b5cf6 (elegant, professional)
- **Accent Red**: #ef4444 (attention, urgency)
- **Neutral**: Grayscale for backgrounds and text

### Typography
- **Font**: Inter (system default)
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

## CI/CD Pipeline

GitHub Actions workflows are configured for:

- **Lint** - ESLint and type checking
- **Test** - Jest tests for frontend and backend
- **Build** - Production builds
- **Deploy** - Automated deployment to staging and production

### Required GitHub Secrets

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RAILWAY_PROJECT_ID
RAILWAY_TOKEN
```

## Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Environment variable validation
- ✅ Audit logging for compliance
- ✅ HTTPS enforced (in production)

## Database Schema

Key entities:
- **User** - Core user model with role
- **DoctorProfile** - Doctor specialization and credentials
- **PatientProfile** - Patient health information
- **Appointment** - Scheduled appointments
- **Procedure** - Medical procedures performed
- **MedicalRecord** - Patient medical history
- **AuditLog** - System activity logging
- **Invoice** - Billing records

## Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push to `main`

### Backend (Railway/Heroku)
1. Create new project on Railway/Heroku
2. Connect GitHub repository
3. Set environment variables and PostgreSQL connection
4. Deploy automatically on push to `main`

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

All PRs must pass linting, tests, and build checks before merging.

## Support & Documentation

For more information, refer to:
- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## License

MIT License - see LICENSE file for details

## Contact

For questions or support, contact the Nairobi Sculpt development team.
