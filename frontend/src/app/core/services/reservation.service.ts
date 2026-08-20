// src/app/core/services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api-base';
import { CreateReservationRequest, ReservationResponse } from '../../shared/models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private http: HttpClient) {}

  create(eventId: number, payload: CreateReservationRequest) {
    return this.http.post<ReservationResponse>(
      `${API_BASE}/events/${eventId}/reservations`,
      payload
    );
  }
}
