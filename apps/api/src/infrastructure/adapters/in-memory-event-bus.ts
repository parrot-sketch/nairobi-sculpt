/**
 * In-Memory Event Bus Implementation
 * Implements the EventBus port
 * In production, replace with message queue (RabbitMQ, Kafka, etc.)
 */

import { Injectable } from '@nestjs/common';
import { DomainEvent, EventBus } from '../../domain/events';

@Injectable()
export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, Set<(event: DomainEvent) => Promise<void>>> = new Map();

  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.type);
    if (!eventHandlers) {
      return;
    }

    // Execute all handlers for this event type
    await Promise.all(Array.from(eventHandlers).map((handler) => handler(event)));
  }

  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }
}
