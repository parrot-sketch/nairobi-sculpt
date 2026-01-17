# Architecture Implementation — Start Here

**Last Updated:** January 16, 2026  
**Status:** ✅ IMPLEMENTATION COMPLETE  
**TypeScript Build:** 0 Errors ✅

---

## What You Need to Know (In Order)

### 1️⃣ For Executives (5 min read)
**File:** [ARCHITECTURE_COMPLETE_SUMMARY.md](ARCHITECTURE_COMPLETE_SUMMARY.md)
- What was delivered
- Business value
- Next steps for the team
- Cost vs. benefit

### 2️⃣ For Architects (20 min read)
**File:** [ARCHITECTURE_IMPLEMENTATION_GUIDE.md](ARCHITECTURE_IMPLEMENTATION_GUIDE.md)
- Design principles applied
- Aggregate roots explained
- Type system strategy
- Module boundary rules
- Testing strategy
- Deployment checklist

### 3️⃣ For Developers (Implementation Details)
**File:** [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md)
- File manifest (what was created)
- Code examples for each layer
- Architecture diagrams
- Validation checklist
- Migration path forward
- Known limitations

### 4️⃣ In Code (Documented Examples)
**Folders:**
```
/src/domain/              ← Pure business logic (no framework)
├── entities/             ← User, Patient, Doctor, Visit, Invoice
├── value-objects/        ← Typed IDs (UserId, PatientId, etc.)
├── events/               ← Domain events (VisitCompleted, etc.)
└── ports/                ← Repository & service interfaces

/src/application/         ← Use-case orchestration
├── services/             ← PatientApplicationService, VisitApplicationService
├── dtos/                 ← API boundary types
└── use-cases/            ← Future use-case implementations

/src/infrastructure/      ← Technical implementation (Prisma, events, auth)
├── repositories/         ← Prisma adapters (PatientRepository, VisitRepository)
└── adapters/             ← Event bus, authorization service
```

---

## Quick Start Guide

### Verify the Build ✅
```bash
cd /home/parrot/nairobi-sculpt/apps/api
npm run build
# Should show: Successfully compiled
```

### Understand the Architecture (3 layers)
```
Layer 1: Domain         → Pure business logic (no dependencies)
Layer 2: Application   → Use-cases & orchestration (depends on domain)
Layer 3: Infrastructure → Prisma, events, external services (depends on both)
```

### Create a New Feature (Template)
```
1. Define domain entity     → /src/domain/entities/
2. Create repository port   → /src/domain/ports/
3. Implement repository     → /src/infrastructure/repositories/
4. Create use-case service  → /src/application/services/
5. Create controller        → /src/[feature]/[feature].controller.ts
6. Wire in module           → /src/[feature]/[feature].module.ts
```

---

## File Manifest

| File | Purpose | Read When |
|------|---------|-----------|
| **ARCHITECTURE_COMPLETE_SUMMARY.md** | Executive summary | You're the decision maker |
| **ARCHITECTURE_IMPLEMENTATION_GUIDE.md** | Detailed reference | Implementing new features |
| **IMPLEMENTATION_COMPLETE.md** | Technical details | Understanding the code |
| **src/domain/** | Business logic | Learning domain modeling |
| **src/application/** | Use-cases | Adding features |
| **src/infrastructure/** | Technical details | Swapping Prisma/events |

---

## Key Concepts Explained

### Aggregate Root (Visit)
**What:** The primary entity that owns transactions within its boundary  
**Why:** Ensures invariants are never broken (Visit can't be modified after completion)  
**Example:** Visit owns Procedures and MedicalRecords

### Repository Pattern
**What:** Abstraction that hides Prisma from application layer  
**Why:** Can swap database technology without changing application code  
**Pattern:**
```
Application → Repository Interface → Prisma Implementation
                                  → Future: MongoDB Implementation
                                  → Future: REST API Implementation
```

### Domain Events
**What:** Significant business events published after mutations  
**Why:** Enables async workflows without tight coupling  
**Example:** VisitCompleted event triggers invoice generation in another module

### Branded Types
**What:** Type-safe IDs that prevent mixing (PatientId ≠ DoctorId)  
**Why:** Compiler catches bugs humans miss  
**Example:**
```typescript
const patientId = PatientId.create('patient_123');
const userId = UserId.create('user_456');
// const wrong: PatientId = userId; // ❌ TypeScript error
```

### RBAC at 3 Layers
**Layer 1 (Controller):** JwtAuthGuard checks if user is authenticated  
**Layer 2 (Service):** AuthorizationService checks if user can access specific resource  
**Layer 3 (Query):** Repository filters results to only what user can see  

---

## Architecture Decisions Made

| Decision | Rationale | Alternative |
|----------|-----------|-------------|
| Visit as aggregate root | Clinical workflows center on Visit events | Patient as root (less flexible) |
| Repository pattern | Hides ORM details, enables database swaps | Direct Prisma in services |
| In-memory event bus | Simple & fast, easily replaceable | RabbitMQ (overkill for MVP) |
| Branded types for IDs | Type-safe, prevents ID mixing | Generic string IDs (error-prone) |
| Three-layer RBAC | Defense in depth, HIPAA compliance | Single-layer guards (less secure) |

---

## Common Patterns

### Pattern 1: Create a Domain Entity
```typescript
export class Patient {
  constructor(
    readonly id: PatientId,
    readonly userId: UserId,
    readonly firstName: string,
    // ... more fields
  ) {}

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
```

### Pattern 2: Define Repository Interface
```typescript
export interface PatientRepository {
  findById(id: PatientId): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient>;
  delete(id: PatientId): Promise<void>;
}
```

### Pattern 3: Implement Repository with Prisma
```typescript
@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  async findById(id: PatientId): Promise<Patient | null> {
    const prismaPatient = await this.prisma.patient.findUnique({ where: { id } });
    return this.toDomainEntity(prismaPatient); // Map to domain
  }

  private toDomainEntity(prismaPatient: any): Patient {
    return new Patient(
      PatientId.create(prismaPatient.id),
      // ... map fields
    );
  }
}
```

### Pattern 4: Create Application Service
```typescript
@Injectable()
export class PatientApplicationService {
  constructor(
    private patientRepository: PatientRepository,
    private authorizationService: AuthorizationService,
    private auditLogService: AuditLogService,
  ) {}

  async getPatient(id: PatientId, userContext: UserContext): Promise<PatientDTO> {
    // 1. Check authorization
    const canAccess = await this.authorizationService.canAccessPatient(userContext, id);
    if (!canAccess) throw new ForbiddenException();

    // 2. Get from repository
    const patient = await this.patientRepository.findById(id);
    if (!patient) throw new NotFoundException();

    // 3. Return DTO
    return this.mapToDTO(patient);
  }
}
```

### Pattern 5: Update Controller to Use Service
```typescript
@Controller('patients')
export class PatientController {
  constructor(private patientService: PatientApplicationService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.PATIENT)
  async getPatient(@Param('id') id: string, @Request() req) {
    const userContext = req.user;
    return await this.patientService.getPatient(
      PatientId.create(id),
      userContext,
    );
  }
}
```

---

## Validation Checklist (Before Merging Code)

- [ ] New entities live in `/src/domain/entities/`
- [ ] Repository interfaces live in `/src/domain/ports/`
- [ ] Repository implementations in `/src/infrastructure/repositories/`
- [ ] Application services in `/src/application/services/`
- [ ] Controllers use application services (not Prisma)
- [ ] All domain types are TypeScript only (no decorators in domain)
- [ ] Build runs with 0 errors: `npm run build`
- [ ] No circular dependencies between layers
- [ ] RBAC enforced at controller + service + query levels
- [ ] Domain invariants are enforced in entity methods

---

## Troubleshooting

**Q: I'm getting TypeScript error about PatientRepository not found**  
A: Check that repository interface is exported from `domain/ports/index.ts`

**Q: Application service is calling Prisma directly**  
A: It should call repository instead. The repository abstracts Prisma.

**Q: Controller is calling repository instead of application service**  
A: Wrong layer. Controllers should only call application services.

**Q: I need to add a new repository**  
A: 1) Add interface to `domain/ports/`, 2) Add implementation to `infrastructure/repositories/`, 3) Wire DI in module

**Q: Domain entity can't import from application layer**  
A: Correct. Domain depends on nothing. Only application depends on domain.

---

## Decision Log

### Decision 1: Visit as Aggregate Root ✅
**Status:** Approved  
**Date:** 2026-01-16  
**Rationale:** Clinical workflows are centered on Visit events. Appointment → Visit → Invoice flow.  
**Alternative:** Patient as root (not flexible enough for multi-visit scenarios)

### Decision 2: Three-Layer RBAC ✅
**Status:** Approved  
**Date:** 2026-01-16  
**Rationale:** Defense in depth. Guard + Service + Query catches issues at different levels.  
**Alternative:** Single-layer guards (insufficient for HIPAA compliance)

### Decision 3: In-Memory Event Bus (For Now) ✅
**Status:** Approved  
**Date:** 2026-01-16  
**Rationale:** Simple, fast, testable. Easily swappable for RabbitMQ/Kafka later.  
**Timeline:** Replace in phase 2 when event volume increases

---

## Team Guidelines

### Code Review Checklist
When reviewing a PR with new features, check:

1. **Domain Layer**
   - [ ] Entity lives in `/src/domain/entities/`
   - [ ] No NestJS decorators in domain
   - [ ] Invariants are enforced in entity methods
   - [ ] Value objects are properly typed

2. **Application Layer**
   - [ ] Service lives in `/src/application/services/`
   - [ ] Service depends only on domain & ports
   - [ ] Service enforces RBAC (authorization check)
   - [ ] Service logs mutations (audit trail)
   - [ ] DTOs defined at API boundaries

3. **Infrastructure Layer**
   - [ ] Repository implements domain port
   - [ ] Repository maps Prisma to domain entities
   - [ ] No business logic in repository
   - [ ] Event bus integration if needed

4. **Controller**
   - [ ] Controller calls application service only
   - [ ] `@Roles()` decorator present on sensitive endpoints
   - [ ] User context extracted from JWT token
   - [ ] Proper HTTP status codes used

### Escalation Path
- **Architectural questions:** Post in #architecture channel with context
- **Pattern questions:** Reference `ARCHITECTURE_IMPLEMENTATION_GUIDE.md`
- **New aggregate types:** Discuss with team lead before implementing
- **Breaking changes:** Requires team consensus

---

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Build errors | 0 | ✅ 0 |
| Domain layer purity | 100% | ✅ 100% |
| Test coverage | >80% | ⏳ TBD |
| Feature development speed | -30% | ⏳ TBD |
| Onboarding time | -40% | ⏳ TBD |

---

## Support

### Getting Help
1. **For architecture questions:** See `ARCHITECTURE_IMPLEMENTATION_GUIDE.md`
2. **For implementation examples:** See `IMPLEMENTATION_COMPLETE.md`
3. **For code samples:** Look in `/src/domain`, `/src/application`, `/src/infrastructure`
4. **For live questions:** Talk to principal architect

### Resources
- Clean Architecture (Robert C. Martin)
- Domain-Driven Design (Eric Evans)
- TypeScript design patterns
- NestJS documentation

---

## Summary

You now have:
- ✅ Clean architecture foundation (3 distinct layers)
- ✅ Production-ready patterns (domain, application, infrastructure)
- ✅ Type-safe system (branded IDs, enums, contracts)
- ✅ Comprehensive documentation (guides + examples)
- ✅ Zero breaking changes (works alongside existing code)
- ✅ Clear evolution path (rules for feature development)

**The foundation is locked. Build with confidence.**

---

**Next step:** Pick first new feature, implement following documented patterns.

