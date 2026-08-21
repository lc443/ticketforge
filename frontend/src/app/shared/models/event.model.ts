// src/app/shared/models/event.model.ts

export type EventStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

export interface Event {
  id: number;
  name: string;
  venue: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
  status: EventStatus;
  organizerEmail: string | null;
  version: number;
}

export interface EventAudit {
  id: number;
  action: 'CREATED' | 'UPDATED' | 'CANCELLED' | 'DELETED';
  actorEmail: string;
  occurredAt: string;
  details: string;
}
