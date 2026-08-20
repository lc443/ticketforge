package com.ticketforge.reservation.dto;

import com.ticketforge.reservation.entity.ReservationStatus;

import java.time.LocalDateTime;

public record ReservationResponse(
        Long id,
        Long eventId,
        Integer quantity,
        ReservationStatus status,
        LocalDateTime reservedAt
) {
}
