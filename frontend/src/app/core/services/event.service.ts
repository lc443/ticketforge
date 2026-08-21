// src/app/core/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api-base';
import { Event, EventAudit, EventStatus } from '../../shared/models/event.model';

export type EventWriteRequest = Pick<Event, 'name' | 'venue' | 'eventDate' | 'totalTickets'> & {
  version?: number;
};

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Event[]>(`${API_BASE}/events`);
  }

  getById(id: number) {
    return this.http.get<Event>(`${API_BASE}/events/${id}`);
  }

  create(payload: EventWriteRequest) {
    return this.http.post<Event>(`${API_BASE}/events`, payload);
  }

  update(id: number, payload: EventWriteRequest) {
    return this.http.put<Event>(`${API_BASE}/events/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_BASE}/events/${id}`);
  }

  updateStatus(id: number, status: EventStatus) {
    return this.http.patch<Event>(`${API_BASE}/events/${id}/status`, { status });
  }

  audit(id: number) {
    return this.http.get<EventAudit[]>(`${API_BASE}/events/${id}/audit`);
  }
}
