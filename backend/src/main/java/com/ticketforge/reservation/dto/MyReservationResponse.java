package com.ticketforge.reservation.dto;

import com.ticketforge.reservation.entity.ReservationStatus;

import java.time.LocalDateTime;

public record MyReservationResponse(
        Long id,
        Long eventId,
        String eventName,
        String venue,
        LocalDateTime eventDate,
        Integer quantity,
        ReservationStatus status,
        LocalDateTime reservedAt
) {
}
