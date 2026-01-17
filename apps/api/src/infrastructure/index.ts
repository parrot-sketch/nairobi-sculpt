/**
 * Infrastructure Layer
 * Adapters, repositories, frameworks, external services
 * Depends on domain + application, not the other way around
 */

export * from './repositories/prisma-patient.repository';
export * from './repositories/prisma-visit.repository';
export * from './adapters/in-memory-event-bus';
export * from './adapters/prisma-authorization.service';
