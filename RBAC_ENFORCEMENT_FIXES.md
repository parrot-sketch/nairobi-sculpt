# RBAC Enforcement Fixes - Implementation Guide

**Objective:** Remediate identified access control gaps with minimal, surgical changes.

**Total Changes Required:** 4 fixes across 2 controllers  
**Lines of Code:** ~25 additions  
**Breaking Changes:** None (only adding missing access, not removing)  
**Deployment Risk:** LOW

---

## Summary of Fixes

| Priority | Gap | Files | Complexity | Impact |
|----------|-----|-------|-----------|--------|
| 1 | Patient procedure list visibility | procedures.controller.ts | 1 change | Patient transparency |
| 2 | Frontdesk invoice creation | invoice.controller.ts | 4 changes | Operational efficiency |
| 3 | Frontdesk appointment view | appointment.controller.ts | 0 changes | (Covered by existing endpoints) |
| 4 | Doctor schedule list | doctor.controller.ts | 0 changes | (No public endpoint exists) |

---

## Fix #1: Patient Procedure List Visibility [MEDIUM]

**Current State:**
```typescript
// ❌ PROBLEM: Patients cannot list their own procedures
@Get('patient/:patientId')
@Roles(['DOCTOR', 'ADMIN'])  // ← PATIENT missing
async getProceduresByPatient(@Param('patientId') patientId: string) {
  return this.procedureService.getProceduresByPatient(patientId);
}
```

**Why This Matters:**
- Patients can see individual procedures by ID (with ownership check)
- But cannot list procedures performed on them
- Healthcare transparency issue: "What procedures have I had?"

**Recommended Fix:**

**File:** [src/procedures/procedure.controller.ts](src/procedures/procedure.controller.ts#L43-L47)

```typescript
@Get('patient/:patientId')
@Roles(['DOCTOR', 'ADMIN', 'PATIENT'])  // ✅ Add PATIENT
async getProceduresByPatient(
  @Param('patientId') patientId: string,
  @Request() req: any  // ✅ Add request param for ownership check
) {
  // ✅ Add ownership verification
  if (req.user.role === 'PATIENT' && patientId !== req.user.sub) {
    throw new ForbiddenException('Cannot access other patients procedures');
  }
  return this.procedureService.getProceduresByPatient(patientId);
}
```

**Service Layer:** No changes needed (service already returns procedures for patient).

**Ownership Check Logic:**
- PATIENT role: Can only query own patientId (`patientId === req.user.sub`)
- DOCTOR role: Can query any patientId they have relationship with (implicit via data access)
- ADMIN role: Can query any patientId

**Test Cases:**
```
✓ Patient queries own procedures: GET /api/procedures/patient/{ownPatientId}
✓ Patient queries other procedures: GET /api/procedures/patient/{otherPatientId} → 403
✓ Doctor queries any patient: GET /api/procedures/patient/{anyPatientId} → 200
✓ Admin queries any patient: GET /api/procedures/patient/{anyPatientId} → 200
```

---

## Fix #2: Frontdesk Invoice Access [HIGH]

FRONTDESK staff needs to manage the complete billing lifecycle: create, view, update, record payments.

### Fix #2A: Invoice Creation

**File:** [src/invoices/invoice.controller.ts](src/invoices/invoice.controller.ts#L27-L29)

**Current:**
```typescript
@Post()
@Roles(['ADMIN', 'DOCTOR'])  // ❌ FRONTDESK missing
async create(@Request() req: any, @Body() createDto: CreateInvoiceDto) {
```

**Recommended:**
```typescript
@Post()
@Roles(['ADMIN', 'DOCTOR', 'FRONTDESK'])  // ✅ Add FRONTDESK
async create(@Request() req: any, @Body() createDto: CreateInvoiceDto) {
```

**Rationale:** Frontdesk initiates billing after visit completion.

---

### Fix #2B: Invoice List by Patient

**File:** [src/invoices/invoice.controller.ts](src/invoices/invoice.controller.ts#L37-L42)

**Current:**
```typescript
@Get('patient/:patientId')
@Roles(['PATIENT', 'ADMIN'])  // ❌ FRONTDESK missing
async getInvoicesByPatient(@Param('patientId') patientId: string, @Request() req: any) {
  if (req.user.role === 'PATIENT' && patientId !== req.user.sub) {
    throw new ForbiddenException('Cannot access other patients invoices');
  }
  return this.invoiceService.getInvoicesByPatient(patientId);
}
```

**Recommended:**
```typescript
@Get('patient/:patientId')
@Roles(['PATIENT', 'ADMIN', 'FRONTDESK'])  // ✅ Add FRONTDESK
async getInvoicesByPatient(@Param('patientId') patientId: string, @Request() req: any) {
  // ✅ Update ownership check to include FRONTDESK
  if ((req.user.role === 'PATIENT' || req.user.role === 'FRONTDESK') && patientId !== req.user.sub) {
    throw new ForbiddenException('Cannot access other patients invoices');
  }
  return this.invoiceService.getInvoicesByPatient(patientId);
}
```

**Rationale:** Frontdesk needs to view patient billing history.

**Note on FRONTDESK scope:** FRONTDESK should see invoices for any patient they're coordinating with, not restricted by ownership. Consider separate endpoint or role-based query filtering. Current implementation with `patientId !== req.user.sub` assumes FRONTDESK userId is a patient (incorrect). **Recommend:** Remove ownership check for FRONTDESK, rely on ADMIN oversight.

**Better Implementation:**
```typescript
@Get('patient/:patientId')
@Roles(['PATIENT', 'ADMIN', 'FRONTDESK'])
async getInvoicesByPatient(@Param('patientId') patientId: string, @Request() req: any) {
  // Patient can only see own invoices
  if (req.user.role === 'PATIENT' && patientId !== req.user.sub) {
    throw new ForbiddenException('Cannot access other patients invoices');
  }
  // FRONTDESK and ADMIN can see any patient's invoices
  return this.invoiceService.getInvoicesByPatient(patientId);
}
```

---

### Fix #2C: Invoice Update

**File:** [src/invoices/invoice.controller.ts](src/invoices/invoice.controller.ts#L49-L55)

**Current:**
```typescript
@Put(':invoiceId')
@Roles(['ADMIN', 'DOCTOR'])  // ❌ FRONTDESK missing
async update(
  @Param('invoiceId') invoiceId: string,
  @Body() updateDto: UpdateInvoiceDto,
  @Request() req: any,
) {
```

**Recommended:**
```typescript
@Put(':invoiceId')
@Roles(['ADMIN', 'DOCTOR', 'FRONTDESK'])  // ✅ Add FRONTDESK
async update(
  @Param('invoiceId') invoiceId: string,
  @Body() updateDto: UpdateInvoiceDto,
  @Request() req: any,
) {
```

**Rationale:** Frontdesk marks invoices as paid, pending, etc.

---

### Fix #2D: Record Payment

**File:** [src/invoices/invoice.controller.ts](src/invoices/invoice.controller.ts#L61-L67)

**Current:**
```typescript
@Post(':invoiceId/payments')
@Roles(['ADMIN', 'DOCTOR', 'PATIENT'])  // ❌ FRONTDESK missing
async recordPayment(
  @Param('invoiceId') invoiceId: string,
  @Body() paymentDto: CreatePaymentDto,
  @Request() req: any,
) {
```

**Recommended:**
```typescript
@Post(':invoiceId/payments')
@Roles(['ADMIN', 'DOCTOR', 'PATIENT', 'FRONTDESK'])  // ✅ Add FRONTDESK
async recordPayment(
  @Param('invoiceId') invoiceId: string,
  @Body() paymentDto: CreatePaymentDto,
  @Request() req: any,
) {
```

**Rationale:** Frontdesk records patient payments (cash, card, check).

---

## Fix #3: Appointment Scheduling (FRONTDESK)

**Current State:** Appointment endpoints allow PATIENT to create, DOCTOR/ADMIN to confirm/cancel.

**Question:** Should FRONTDESK be able to schedule appointments directly (without patient request)?

**Option A: No** (Current model: patient-initiated)
- Patient requests appointment via POST /appointments
- FRONTDESK staff see and confirm via doctor's view (implicit access via ADMIN elevation)
- Doctor confirms timing
- No changes needed

**Option B: Yes** (Administrative scheduling)
- FRONTDESK can create appointments on behalf of patient
- Requires new endpoint or modified logic
- `@Post('schedule')` with patient selection + doctor selection

**Recommendation:** Keep Option A (patient-initiated). FRONTDESK manages availability via doctor schedules, not direct appointment creation. This maintains consent-based healthcare model.

**Decision:** No changes needed for appointments.

---

## Fix #4: Doctor Schedule Access

**Current State:** Only doctors can view own schedule.

**Endpoints:**
- Doctor: `@Get('schedule')` @Roles(['DOCTOR']) → returns own schedule
- Admin: Can see all doctors' schedules (implicit)

**Question:** Should FRONTDESK view doctor availability for scheduling?

**Recommendation:** Add read-only endpoint for FRONTDESK:

**File:** [src/doctors/doctor.controller.ts](src/doctors/doctor.controller.ts) - Add new endpoint

```typescript
@Get('schedule/:doctorId')  // Add this new endpoint
@Roles(['FRONTDESK', 'ADMIN'])  // ✅ FRONTDESK can view doctor availability
async getPublicSchedule(@Param('doctorId') doctorId: string) {
  // Return only availability info, no sensitive data
  return this.doctorService.getSchedule(doctorId);
}
```

**Or modify existing:**
```typescript
@Get('schedule')  // For doctors to see their own
@Roles(['DOCTOR'])
async getSchedule(@Request() req: any) {
  return this.doctorService.getSchedule(req.user.sub);
}

@Get(':doctorId/schedule')  // ✅ Add for FRONTDESK to see others
@Roles(['DOCTOR', 'ADMIN', 'FRONTDESK'])
async getSchedulePublic(@Param('doctorId') doctorId: string, @Request() req: any) {
  // Doctors can only see own, FRONTDESK can see any, admin can see any
  if (req.user.role === 'DOCTOR' && doctorId !== req.user.sub) {
    throw new ForbiddenException('Cannot access other doctors schedules');
  }
  return this.doctorService.getSchedule(doctorId);
}
```

**Decision:** Recommended but not critical. Defer to future implementation if needed.

---

## Implementation Checklist

### Code Changes (Total: 4 minimal fixes)

**File 1: src/procedures/procedure.controller.ts**
- [ ] Line ~43: Add PATIENT to @Roles decorator
- [ ] Line ~43: Add @Request() req: any parameter
- [ ] Line ~46: Add ownership check for PATIENT role

**File 2: src/invoices/invoice.controller.ts**
- [ ] Line ~28: Add FRONTDESK to @Roles(['ADMIN', 'DOCTOR', 'FRONTDESK'])
- [ ] Line ~40: Add FRONTDESK to @Roles(['PATIENT', 'ADMIN', 'FRONTDESK'])
- [ ] Line ~41: Update ownership check logic for FRONTDESK (see above)
- [ ] Line ~52: Add FRONTDESK to @Roles(['ADMIN', 'DOCTOR', 'FRONTDESK'])
- [ ] Line ~64: Add FRONTDESK to @Roles(['ADMIN', 'DOCTOR', 'PATIENT', 'FRONTDESK'])

### Testing

```bash
# Test Fix #1: Patient procedure list
curl -H "Authorization: Bearer ${PATIENT_TOKEN}" \
  GET /api/procedures/patient/{patientId}  # Should return 200

curl -H "Authorization: Bearer ${OTHER_PATIENT_TOKEN}" \
  GET /api/procedures/patient/{patientId}  # Should return 403

# Test Fix #2: Frontdesk invoice creation
curl -H "Authorization: Bearer ${FRONTDESK_TOKEN}" \
  -X POST /api/invoices \
  -d '{"patientId":"...", "amount": 100}'  # Should return 200

# Verify no regression
curl -H "Authorization: Bearer ${PATIENT_TOKEN}" \
  GET /api/invoices/patient/{patientId}  # Should still work
```

### Deployment

1. **Backup:** Save current controller files
2. **Code:** Apply 4 changes (5 lines each)
3. **Test:** Run unit tests for appointment/invoice/procedure controllers
4. **Build:** `npm run build` - verify 0 errors
5. **Deploy:** Standard deployment process
6. **Monitor:** Check audit logs for FRONTDESK access patterns

### Rollback

If issues arise, revert 4 lines:
1. Remove FRONTDESK from @Roles decorators (invoice endpoints)
2. Remove PATIENT from @Roles decorator (procedure endpoint)
3. Remove ownership check from procedures endpoint

---

## Impact Assessment

### Positive Impacts
- ✅ Patient transparency: Can see procedures performed
- ✅ Operational efficiency: FRONTDESK staff can do their jobs
- ✅ Reduced privilege escalation: Less need for admin accounts
- ✅ Compliance: Better audit trail for billing operations

### Negative Impacts
- ⚠️ None identified
- ⚠️ Potential: If FRONTDESK not properly trained, could create duplicate invoices

### Risk Mitigation
- Add validation in service: Check for existing invoices before creating
- Log all FRONTDESK billing actions to AuditLog
- Require supervisor approval for large invoices (future enhancement)

---

## Completion Verification

After implementing all fixes, verify:

```bash
# Build verification
npm run build
# Output: Build successful - Zero errors

# Endpoint verification
grep -r "@Roles\(\['PATIENT'" apps/api/src/procedures/procedure.controller.ts
# Output: Should contain @Roles(['DOCTOR', 'ADMIN', 'PATIENT'])

grep -r "@Roles\(\['.*FRONTDESK" apps/api/src/invoices/invoice.controller.ts
# Output: Should show FRONTDESK in 4 locations

# Ownership check verification
grep -r "Cannot access other patients procedures" apps/api/src/procedures/
# Output: Should exist in controller
```

---

**Implementation Status:** READY FOR DEPLOYMENT  
**Estimated Effort:** 15-30 minutes  
**Risk Level:** LOW
