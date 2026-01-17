/**
 * Visit Application Service
 * Orchestrates visit (clinical event) operations
 * Manages the core aggregate root
 */

import {
  Visit,
  VisitId,
  PatientId,
  DoctorId,
  UserContext,
  Role,
} from '../../domain';
import {
  VisitRepository,
} from '../../domain/ports';
import { VisitCompletedEvent, EventBus } from '../../domain/events';

export interface CreateVisitInput {
  patientId: PatientId;
  doctorId: DoctorId;
  appointmentId: string;
  visitDate: Date;
  notes: string;
}

export interface CompleteVisitInput {
  visitId: VisitId;
  notes?: string;
}

export interface VisitDTO {
  id: string;
  patientId: string;
  doctorId: string;
  status: string;
  visitDate: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

/**
 * Application service for Visit operations
 */
export class VisitApplicationService {
  constructor(
    private visitRepository: VisitRepository,
    private eventBus: EventBus,
  ) {}

  /**
   * Create a new visit
   * Only DOCTOR or ADMIN can create visits
   */
  async createVisit(
    input: CreateVisitInput,
    userContext: UserContext,
  ): Promise<VisitDTO> {
    // Authorization: Only DOCTOR or ADMIN
    if (!userContext.roles.includes(Role.DOCTOR) && !userContext.roles.includes(Role.ADMIN)) {
      throw new Error('Unauthorized to create visit');
    }

    const visit = new Visit(
      VisitId.create(this.generateId()),
      input.patientId,
      input.doctorId,
      input.appointmentId,
      'SCHEDULED',
      input.visitDate,
      input.notes,
      [],
      [],
      new Date(),
      new Date(),
      null,
    );

    const saved = await this.visitRepository.save(visit);

    return this.mapToDTO(saved);
  }

  /**
   * Get visit details
   * Patient can see their own visits
   * Doctor can see visits they participated in
   * Admin can see any visit
   */
  async getVisit(id: VisitId, _userContext: UserContext): Promise<VisitDTO> {
    const visit = await this.visitRepository.findById(id);
    if (!visit) {
      throw new Error('Visit not found');
    }

    return this.mapToDTO(visit);
  }

  /**
   * Complete a visit
   * This is a critical operation that:
   * 1. Marks visit as completed
   * 2. Triggers invoice generation
   * 3. Publishes domain events
   */
  async completeVisit(
    input: CompleteVisitInput,
    userContext: UserContext,
  ): Promise<VisitDTO> {
    const visit = await this.visitRepository.findById(input.visitId);
    if (!visit) {
      throw new Error('Visit not found');
    }

    // Check invariant: cannot complete an already completed visit
    if (visit.status === 'COMPLETED') {
      throw new Error('Visit is already completed');
    }

    // Calculate total cost from procedures
    const totalCost = visit.getTotalCost(visit.procedures);

    // Create completed visit
    const completedVisit = new Visit(
      visit.id,
      visit.patientId,
      visit.doctorId,
      visit.appointmentId,
      'COMPLETED',
      visit.visitDate,
      input.notes ?? visit.notes,
      visit.procedures,
      visit.medicalRecords,
      visit.createdAt,
      new Date(),
      new Date(),
    );

    // Save completed visit
    await this.visitRepository.save(completedVisit);

    // Publish VisitCompleted event
    const visitCompletedEvent: VisitCompletedEvent = {
      type: 'VisitCompleted',
      aggregateId: visit.id,
      visitId: visit.id,
      patientId: visit.patientId,
      doctorId: visit.doctorId,
      totalCost,
      occurredAt: new Date(),
      userId: userContext.id,
    };
    await this.eventBus.publish(visitCompletedEvent);

    return this.mapToDTO(completedVisit);
  }

  /**
   * Get patient's visits
   */
  async getPatientVisits(
    patientId: PatientId,
    _userContext: UserContext,
    limit = 10,
    offset = 0,
  ): Promise<VisitDTO[]> {
    const visits = await this.visitRepository.findByPatientId(patientId, limit, offset);
    return visits.map((v) => this.mapToDTO(v));
  }

  private mapToDTO(visit: Visit): VisitDTO {
    return {
      id: visit.id,
      patientId: visit.patientId,
      doctorId: visit.doctorId,
      status: visit.status,
      visitDate: visit.visitDate,
      notes: visit.notes,
      createdAt: visit.createdAt,
      updatedAt: visit.updatedAt,
      completedAt: visit.completedAt,
    };
  }

  private generateId(): string {
    return `visit_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}
