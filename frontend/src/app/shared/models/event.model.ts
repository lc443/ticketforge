// src/app/shared/models/event.model.ts

export interface Event {
  id: number;
  name: string;
  venue: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
}
