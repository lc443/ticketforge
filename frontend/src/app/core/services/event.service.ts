// src/app/core/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api-base';
import { Event } from '../../shared/models/event.model';

export type EventWriteRequest = Pick<Event, 'name' | 'venue' | 'eventDate' | 'totalTickets'>;

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Event[]>(`${API_BASE}/events`);
  }

  getById(id: number) {
    return this.http.get<Event>(`${API_BASE}/events/${id}`);
  }

  // No role check on the backend today — SecurityConfig only requires
  // .anyRequest().authenticated(), so any signed-in user can create an
  // event. Not gating this in the UI either; it should reflect what the
  // API actually enforces, not an admin-only behavior that doesn't exist.
  create(payload: EventWriteRequest) {
    return this.http.post<Event>(`${API_BASE}/events`, payload);
  }

  update(id: number, payload: EventWriteRequest) {
    return this.http.put<Event>(`${API_BASE}/events/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_BASE}/events/${id}`);
  }
}
