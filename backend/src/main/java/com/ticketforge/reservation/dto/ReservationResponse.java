package com.ticketforge.reservation.dto;

import com.ticketforge.reservation.entity.ReservationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationResponse(
        UUID id,
        UUID eventId,
        Integer quantity,
        ReservationStatus status,
        LocalDateTime reservedAt
) {
}