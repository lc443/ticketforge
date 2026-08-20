// src/app/core/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api-base';
import { Event } from '../../shared/models/event.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  list() {
    return this.http.get<Event[]>(`${API_BASE}/events`);
  }

  getById(id: number) {
    return this.http.get<Event>(`${API_BASE}/events/${id}`);
  }
}
