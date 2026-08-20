// src/app/shared/models/reservation.model.ts

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED';

export interface CreateReservationRequest {
  quantity: number;
}

export interface ReservationResponse {
  id: string;
  eventId: string;
  quantity: number;
  status: ReservationStatus;
  reservedAt: string;
}
