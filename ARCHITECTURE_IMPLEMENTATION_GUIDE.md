# Architecture Implementation Guide

## Overview

This document describes the clean architecture implementation for Nairobi Sculpt. The codebase is now organized into three distinct layers:

- **Domain Layer** (`/src/domain`) - Pure business logic, no frameworks
- **Application Layer** (`/src/application`) - Orchestration and use-cases
- **Infrastructure Layer** (`/src/infrastructure`) - Frameworks, adapters, Prisma

---

## Directory Structure

```
src/
├── domain/                           # Pure domain logic
│   ├── entities/                     # Domain entities (User, Patient, Doctor, Visit, Invoice, Appointment)
│   ├── value-objects/                # Value objects (UserId, PatientId, Money, Role, etc.)
│   ├── events/                       # Domain events (VisitCompleted, PaymentRecorded, etc.)
│   ├── ports/                        # Repository and service interfaces (contracts)
│   └── index.ts                      # Domain exports
│
├── application/                      # Use-cases and orchestration
│   ├── services/                     # Application services (PatientApplicationService, VisitApplicationService)
│   ├── use-cases/                    # Use-case implementations
│   ├── dtos/                         # DTOs for API boundaries
│   └── index.ts                      # Application exports
│
├── infrastructure/                   # External services, adapters, frameworks
│   ├── repositories/                 # Prisma repository implementations
│   │   ├── prisma-patient.repository.ts
│   │   └── prisma-visit.repository.ts
│   ├── adapters/                     # Service adapters
│   │   ├── in-memory-event-bus.ts
│   │   └── prisma-authorization.service.ts
│   └── index.ts                      # Infrastructure exports
│
├── patients/                         # Feature module (EXISTING)
├── doctors/                          # Feature module (EXISTING)
├── appointments/                     # Feature module (EXISTING)
├── procedures/                       # Feature module (EXISTING)
├── medical-records/                  # Feature module (EXISTING)
├── invoices/                         # Feature module (EXISTING)
├── audit/                            # Feature module (EXISTING)
├── auth/                             # Feature module (EXISTING)
├── common/                           # Shared utilities (EXISTING)
├── prisma/                           # Prisma service (EXISTING)
└── main.ts                           # Entry point
```

---

## Layer Responsibilities

### Domain Layer (`/src/domain`)

**Purpose:** Represent the core business logic of a healthcare system.

**Responsibilities:**
- Define entities (User, Patient, Doctor, Visit, Invoice)
- Define value objects (UserId, PatientId, Money, Role)
- Define domain events (VisitCompleted, PaymentRecorded)
- Define repository and service ports (interfaces)
- Enforce invariants and business rules

**Dependencies:** None (pure TypeScript, no framework dependencies)

**Key Files:**
- `entities/index.ts` - Core entities with invariants
- `value-objects/index.ts` - Type-safe IDs and domain values
- `events/index.ts` - Domain events for async workflows
- `ports/index.ts` - Repository interfaces (contracts)

**Example - Visit Aggregate Root:**
```typescript
export class Visit {
  constructor(
    readonly id: VisitId,
    readonly patientId: PatientId,
    readonly doctorId: DoctorId,
    readonly status: VisitStatus,
    // ...
  ) {}

  // Business rules (invariants)
  isModifiable(): boolean {
    return this.status !== VisitStatus.COMPLETED;
  }

  getTotalCost(procedures: VisitProcedure[]): Money {
    const totalAmount = procedures.reduce((sum, proc) => sum + proc.cost.amount, 0);
    return { amount: totalAmount, currency: 'KES' };
  }
}
```

---

### Application Layer (`/src/application`)

**Purpose:** Orchestrate domain logic and implement use-cases.

**Responsibilities:**
- Implement use-case services (CreatePatient, CompleteVisit, etc.)
- Coordinate between domain entities and repositories
- Enforce RBAC authorization
- Publish domain events
- Log audit trails
- Define DTOs for API boundaries

**Dependencies:** Domain layer (entities, value-objects, ports, events)

**Key Files:**
- `services/patient.application.service.ts` - Patient use-cases
- `services/visit.application.service.ts` - Visit use-cases

**Example - Patient Application Service:**
```typescript
export class PatientApplicationService {
  constructor(
    private patientRepository: PatientRepository,
    private authorizationService: AuthorizationService,
    private auditLogService: AuditLogService,
  ) {}

  async createPatient(
    input: CreatePatientInput,
    userContext: UserContext,
  ): Promise<PatientDTO> {
    // 1. Authorize
    if (!userContext.roles.includes(Role.ADMIN) && userContext.id !== input.userId) {
      throw new Error('Unauthorized');
    }

    // 2. Create domain entity
    const patient = new Patient(/* ... */);

    // 3. Persist via repository (abstracted)
    const saved = await this.patientRepository.save(patient);

    // 4. Audit log
    await this.auditLogService.logAction(/* ... */);

    // 5. Return DTO
    return this.mapToDTO(saved);
  }
}
```

---

### Infrastructure Layer (`/src/infrastructure`)

**Purpose:** Implement technical concerns (Prisma, event bus, authorization checks).

**Responsibilities:**
- Implement repository interfaces (adapt Prisma to domain)
- Implement event bus
- Implement authorization service
- Manage database transactions
- Handle external API calls

**Dependencies:** Domain layer (entities, ports) + Application layer (services)

**Key Files:**
- `repositories/prisma-patient.repository.ts` - Patient repository implementation
- `repositories/prisma-visit.repository.ts` - Visit repository implementation
- `adapters/in-memory-event-bus.ts` - Event bus implementation
- `adapters/prisma-authorization.service.ts` - Authorization checks

**Example - Prisma Repository:**
```typescript
@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: PatientId): Promise<Patient | null> {
    const prismaPatient = await this.prisma.patient.findUnique({
      where: { id },
    });
    if (!prismaPatient) return null;
    return this.toDomainEntity(prismaPatient); // Map Prisma to domain
  }

  async save(patient: Patient): Promise<Patient> {
    const prismaPatient = await this.prisma.patient.upsert({
      // ...
    });
    return this.toDomainEntity(prismaPatient);
  }

  private toDomainEntity(prismaPatient: any): Patient {
    return new Patient(
      PatientId.create(prismaPatient.id),
      // ... map fields
    );
  }
}
```

---

## Aggregate Roots

The system models four primary aggregates:

### 1. Visit (Primary Aggregate)
- **Purpose:** Represents the central clinical event where care happens
- **Owns:** Procedures, MedicalRecords
- **Produces:** Invoice
- **Invariants:**
  - Cannot exist without a Patient
  - Cannot exist without a Doctor
  - Completed visits are immutable
  - Procedures only valid within a visit

### 2. Patient
- **Purpose:** Represents a healthcare consumer
- **Owns:** Profile, appointment history, medical history
- **Cannot mutate:** Clinical data (read-only for patients)
- **Invariants:**
  - User identity must exist
  - Can only see own data (unless admin)

### 3. Invoice
- **Purpose:** Tracks billing and payment lifecycle
- **Owns:** Payment records
- **Related to:** Visit (via visitId)
- **Invariants:**
  - Total amount must be positive
  - Payments cannot exceed total
  - Paid invoices are immutable

### 4. User
- **Purpose:** Authentication identity and role assignment
- **Owns:** Roles, password hash
- **Links to:** Patient or Doctor via userId
- **Invariants:**
  - Email must be unique
  - Must have at least one role

---

## Module Boundary Rules

These rules enforce clean architecture principles:

### Rule 1: No Direct Prisma Imports
❌ **DO NOT DO:**
```typescript
// WRONG - breaks abstraction
import { PrismaClient } from '@prisma/client';

export class PatientService {
  async getPatient(id: string) {
    const p = await prisma.patient.findUnique({ where: { id } });
    return p; // Returns Prisma model, not domain entity
  }
}
```

✅ **DO THIS:**
```typescript
// CORRECT - uses repository abstraction
import { PatientRepository } from '../../domain/ports';

export class PatientApplicationService {
  constructor(private patientRepository: PatientRepository) {}

  async getPatient(id: PatientId): Promise<PatientDTO> {
    const patient = await this.patientRepository.findById(id); // Returns domain entity
    return this.mapToDTO(patient);
  }
}
```

### Rule 2: Cross-Module Calls Through Exported Services
❌ **DO NOT DO:**
```typescript
// WRONG - direct module coupling
import { PrismaPatientRepository } from '../../infrastructure/repositories';

export class VisitModule {
  async associateWithPatient(patientId) {
    const repo = new PrismaPatientRepository(this.prisma);
    const patient = await repo.findById(patientId);
  }
}
```

✅ **DO THIS:**
```typescript
// CORRECT - loose coupling through application service
import { PatientApplicationService } from '../../application/services';

export class VisitModule {
  constructor(private patientService: PatientApplicationService) {}

  async associateWithPatient(patientId: PatientId, userContext: UserContext) {
    const patient = await this.patientService.getPatient(patientId, userContext);
  }
}
```

### Rule 3: Controllers Only Call Application Layer
❌ **DO NOT DO:**
```typescript
// WRONG - controller accessing infrastructure
export class PatientController {
  constructor(private prisma: PrismaService) {}

  @Get(':id')
  async getPatient(@Param('id') id: string) {
    const p = await this.prisma.patient.findUnique({ where: { id } });
    return p; // Returns Prisma model
  }
}
```

✅ **DO THIS:**
```typescript
// CORRECT - controller uses application service
export class PatientController {
  constructor(private patientService: PatientApplicationService) {}

  @Get(':id')
  async getPatient(@Param('id') id: string, @Request() req) {
    const userContext = req.user; // From JWT token
    const patient = await this.patientService.getPatient(
      PatientId.create(id),
      userContext,
    );
    return patient; // Returns DTO
  }
}
```

### Rule 4: No Infrastructure in Domain
✅ **CORRECT** - Domain has no NestJS, Prisma, or external dependencies:
```typescript
// /src/domain/entities/visit.ts
export class Visit {
  constructor(
    readonly id: VisitId,
    readonly patientId: PatientId,
    readonly status: VisitStatus,
  ) {}

  // Pure business logic, no decorators, no Prisma
  isModifiable(): boolean {
    return this.status !== VisitStatus.COMPLETED;
  }
}
```

---

## Type System Strategy

### Domain Types (Pure)
These are defined in domain layer, independent of any framework:
```typescript
export type UserId = string & { readonly __brand: 'UserId' };
export type PatientId = string & { readonly __brand: 'PatientId' };
export type VisitId = string & { readonly __brand: 'VisitId' };

export class Patient {
  constructor(
    readonly id: PatientId,
    readonly userId: UserId,
    // ... 
  ) {}
}
```

### Prisma Models (Infrastructure)
Prisma models remain in the database schema, never exposed to application layer:
```prisma
model Patient {
  id                String  @id
  userId            String
  firstName         String
  // ... database schema
}
```

### DTOs (Application Boundaries)
DTOs define what the API returns, separate from domain:
```typescript
export interface PatientDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}
```

### Mapping Rules
Explicit mapping functions bridge the layers:

```
Prisma Model → Domain Entity → DTO

// In repository:
private toDomainEntity(prismaPatient: any): Patient {
  return new Patient(
    PatientId.create(prismaPatient.id),
    UserId.create(prismaPatient.userId),
    prismaPatient.firstName,
    // ...
  );
}

// In service:
private mapToDTO(patient: Patient): PatientDTO {
  return {
    id: patient.id,
    firstName: patient.firstName,
    // ...
  };
}
```

---

## Repository Pattern

Repositories abstract persistence and allow for different implementations:

```typescript
// Domain port (interface)
export interface PatientRepository {
  findById(id: PatientId): Promise<Patient | null>;
  save(patient: Patient): Promise<Patient>;
  delete(id: PatientId): Promise<void>;
}

// Infrastructure implementation
@Injectable()
export class PrismaPatientRepository implements PatientRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: PatientId): Promise<Patient | null> {
    const prismaPatient = await this.prisma.patient.findUnique({
      where: { id },
    });
    return prismaPatient ? this.toDomainEntity(prismaPatient) : null;
  }

  async save(patient: Patient): Promise<Patient> {
    // upsert logic
  }
}

// NestJS module provides the implementation
@Module({
  providers: [
    {
      provide: 'PatientRepository',
      useClass: PrismaPatientRepository,
    },
  ],
})
export class PatientModule {}
```

---

## Domain Events

Events represent significant business occurrences that can trigger async workflows:

### Event Types
```typescript
// When a Visit is completed
interface VisitCompletedEvent {
  type: 'VisitCompleted';
  visitId: VisitId;
  patientId: PatientId;
  doctorId: DoctorId;
  totalCost: Money;
}

// When a Payment is recorded
interface PaymentRecordedEvent {
  type: 'PaymentRecorded';
  invoiceId: InvoiceId;
  patientId: PatientId;
  amount: Money;
}
```

### Event Publishing
```typescript
// In visit service when visit is completed
await this.eventBus.publish({
  type: 'VisitCompleted',
  visitId: visit.id,
  patientId: visit.patientId,
  doctorId: visit.doctorId,
  totalCost: visit.getTotalCost(visit.procedures),
  occurredAt: new Date(),
});
```

### Event Subscription
```typescript
// In invoice module, subscribe to visit completion
eventBus.subscribe('VisitCompleted', async (event: VisitCompletedEvent) => {
  // Generate invoice when visit completes
  const invoice = await this.invoiceService.createForVisit(event.visitId, event.totalCost);
});
```

---

## Security & Authorization

### RBAC at Multiple Layers

**1. Controller Level (Guard)**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PATIENT, Role.DOCTOR, Role.ADMIN)
@Get(':id')
async getPatient(@Param('id') id: string) {
  // Only authenticated users with proper role reach here
}
```

**2. Service Level (Ownership Check)**
```typescript
async getPatient(id: PatientId, userContext: UserContext): Promise<PatientDTO> {
  const canAccess = await this.authorizationService.canAccessPatient(
    userContext,
    id,
  );
  if (!canAccess) {
    throw new ForbiddenException('Cannot access patient');
  }
  return await this.patientRepository.findById(id);
}
```

**3. Query Level (Data Filtering)**
```typescript
// Patient service only returns data the user has access to
async getPatientVisits(patientId: PatientId, userContext: UserContext) {
  const canAccess = await this.authorizationService.canAccessPatient(
    userContext,
    patientId,
  );
  if (!canAccess) return [];
  
  return this.visitRepository.findByPatientId(patientId);
}
```

### Authorization Service
The authorization service implements business logic for "can user do X?":

```typescript
export class PrismaAuthorizationService implements AuthorizationService {
  async canAccessPatient(
    userContext: UserContext,
    patientId: PatientId,
  ): Promise<boolean> {
    // ADMIN can access any patient
    if (userContext.roles.includes(Role.ADMIN)) return true;

    // PATIENT can access their own profile
    if (userContext.roles.includes(Role.PATIENT)) {
      const patient = await this.prisma.patient.findUnique({
        where: { id: patientId },
      });
      return patient?.userId === userContext.id;
    }

    // DOCTOR can access patients they've treated
    if (userContext.roles.includes(Role.DOCTOR)) {
      const visit = await this.prisma.visit.findFirst({
        where: { patientId, doctorId: doctor.id },
      });
      return !!visit;
    }

    return false;
  }
}
```

---

## Invariants by Aggregate

### Visit Invariants
- ✅ Must have patientId, doctorId
- ✅ Cannot be modified after completion
- ✅ Procedures can only be added during SCHEDULED status
- ✅ Total cost must be ≥ 0

### Patient Invariants
- ✅ Must have userId (authentication identity)
- ✅ Email must be unique
- ✅ Can only modify own profile (unless ADMIN)
- ✅ Patient sees only their data

### Invoice Invariants
- ✅ Must have patientId and amount
- ✅ Amount must be positive
- ✅ Payments cannot exceed total amount
- ✅ Cannot modify paid invoices

### User Invariants
- ✅ Email must be unique
- ✅ Must have at least one role
- ✅ Password must be hashed

---

## Migration Path

### Phase 1: Domain Layer (Complete ✅)
- ✅ Create `/src/domain` folder structure
- ✅ Define all entities with business logic
- ✅ Define value objects (typed IDs)
- ✅ Define repository ports (interfaces)
- ✅ Define domain events

### Phase 2: Application Layer (Complete ✅)
- ✅ Create `/src/application` folder structure
- ✅ Implement application services
- ✅ Add authorization checks
- ✅ Add audit logging
- ✅ Define DTOs

### Phase 3: Infrastructure Layer (Complete ✅)
- ✅ Create `/src/infrastructure` folder structure
- ✅ Implement repositories (Prisma adapters)
- ✅ Implement event bus
- ✅ Implement authorization service

### Phase 4: Refactor Existing Modules (Next)
- [ ] Update controllers to use application services
- [ ] Remove direct Prisma calls from services
- [ ] Add DI for repositories
- [ ] Test RBAC enforcement
- [ ] Build and verify 0 errors

### Phase 5: Advanced Features (Later)
- [ ] Event handlers (invoice generation on visit completion)
- [ ] Saga pattern for complex workflows
- [ ] Message queue (replace in-memory event bus)
- [ ] CQRS for queries

---

## Testing Strategy

### Unit Tests (Domain Layer)
Test pure business logic without any framework:
```typescript
describe('Visit', () => {
  it('should not allow modification after completion', () => {
    const visit = new Visit(/* ... */, VisitStatus.COMPLETED);
    expect(visit.isModifiable()).toBe(false);
  });
});
```

### Service Tests (Application Layer)
Test use-cases with mocked repositories:
```typescript
describe('PatientApplicationService', () => {
  it('should only allow user to update own profile', async () => {
    const service = new PatientApplicationService(
      mockPatientRepository,
      mockAuthorizationService,
    );

    const userContext = { id: 'user1', roles: [Role.PATIENT] };
    await expect(
      service.updatePatient({ id: 'patient2' }, userContext),
    ).rejects.toThrow('Unauthorized');
  });
});
```

### Integration Tests
Test full flow with real Prisma:
```typescript
describe('Patient Flow', () => {
  it('should create and retrieve patient', async () => {
    const patient = await patientService.createPatient(input, adminContext);
    const retrieved = await patientService.getPatient(patient.id, patientContext);
    expect(retrieved.firstName).toBe(input.firstName);
  });
});
```

---

## Next Steps

1. **Update Controllers** - Inject application services instead of Prisma
2. **Implement Event Handlers** - Wire up invoice generation on visit completion
3. **Add Tests** - Unit tests for domain, integration tests for services
4. **Verify Build** - Run `npm run build` (should have 0 errors)
5. **Run RBAC Fixes** - Apply the 3 gaps identified in RBAC audit

---

## Summary

This architecture provides:
- ✅ **Clear separation of concerns** (domain, application, infrastructure)
- ✅ **Testability** (domain logic has no dependencies)
- ✅ **Flexibility** (swap Prisma for another database without changing domain)
- ✅ **Scalability** (event bus ready for message queue)
- ✅ **Security** (RBAC at multiple layers, audit logging)
- ✅ **Maintainability** (no circular dependencies, explicit contracts)

The system now has a formal architecture that can evolve intentionally rather than accidentally.
