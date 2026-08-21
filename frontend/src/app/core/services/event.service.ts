// src/app/core/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api-base';
import { Event } from '../../shared/models/event.model';

export type CreateEventRequest = Omit<Event, 'id'>;

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
  create(payload: CreateEventRequest) {
    return this.http.post<Event>(`${API_BASE}/events`, payload);
  }
}
