# Quick Start Guide - Nairobi Sculpt

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 20+
- pnpm 10.28+
- PostgreSQL running locally

### 1. Install & Configure (2 min)
```bash
cd nairobi-sculpt

# Install all dependencies
pnpm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Update DATABASE_URL in apps/api/.env
# (e.g., postgresql://user:password@localhost:5432/nairobi_sculpt)
```

### 2. Setup Database (2 min)
```bash
# Create database
createdb nairobi_sculpt

# Generate Prisma client and run migrations
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate

# Seed demo data
pnpm --filter api prisma:seed
```

### 3. Start Development (1 min)
```bash
# Terminal 1: Run all apps
pnpm dev

# Or run separately:
# Terminal 2: Frontend (opens http://localhost:5173)
pnpm --filter web dev

# Terminal 3: Backend (http://localhost:3000)
pnpm --filter api start:dev
```

### 4. Login & Test
```
Email: patient@nairobi-sculpt.com
Password: patient123
```

✅ You're all set! Start developing.

---

## 📚 Common Tasks

### Run Tests
```bash
pnpm test                  # All tests
pnpm --filter web test     # Frontend tests
pnpm --filter api test     # Backend tests
pnpm test:watch           # Watch mode
```

### Code Quality
```bash
pnpm lint                 # Check code
pnpm format              # Fix formatting
pnpm type-check         # TypeScript checking
```

### Build for Production
```bash
pnpm build               # Build all
pnpm --filter web build  # Frontend only
pnpm --filter api build  # Backend only
```

### Database Management
```bash
pnpm --filter api prisma:studio     # Open Prisma UI
pnpm --filter api prisma:migrate    # Create migration
pnpm --filter api prisma:seed       # Re-seed data
```

---

## 📁 Project Structure

```
nairobi-sculpt/
├── apps/
│   ├── web/             # React frontend
│   └── api/             # NestJS backend
├── packages/
│   ├── ui/              # Reusable components
│   ├── config/          # Constants & config
│   └── utils/           # Helper functions
├── .github/workflows/   # CI/CD pipelines
└── docs/               # Documentation
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@nairobi-sculpt.com | patient123 |
| Doctor | doctor@nairobi-sculpt.com | doctor123 |
| Admin | admin@nairobi-sculpt.com | admin123 |
| Frontdesk | frontdesk@nairobi-sculpt.com | frontdesk123 |

---

## 🎨 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: NestJS + TypeScript + Prisma + PostgreSQL
- **Testing**: Jest + React Testing Library + Supertest
- **DevOps**: pnpm + Turborepo + GitHub Actions

---

## 📖 Documentation

- **README.md** - Project overview
- **DEVELOPMENT.md** - Developer guide
- **CONTRIBUTING.md** - Contribution guidelines
- **IMPLEMENTATION_CHECKLIST.md** - What was implemented
- **SCAFFOLD_SUMMARY.md** - Detailed summary

---

## 🚨 Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -i :3000    # Backend
lsof -i :5173    # Frontend

# Kill it
kill -9 <PID>
```

### Database connection error
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL in .env
# Re-run migrations
pnpm --filter api prisma:migrate
```

### Module not found
```bash
# Reinstall and rebuild
pnpm clean
pnpm install
pnpm build
```

---

## 💡 Next Steps

1. ✅ Review README.md for architecture
2. ✅ Check DEVELOPMENT.md for detailed setup
3. ✅ Explore the codebase
4. ✅ Run tests to verify everything works
5. ✅ Read CONTRIBUTING.md before creating PRs

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and test
3. Commit: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request

---

## 📞 Support

- Check documentation files
- Review existing GitHub issues
- Ask team members
- Create new issue with details

---

Happy coding! 🎉
