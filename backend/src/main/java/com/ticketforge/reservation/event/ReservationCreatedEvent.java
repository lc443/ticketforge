package com.ticketforge.reservation.event;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReservationCreatedEvent(
        UUID reservationId,
        UUID eventId,
        Integer quantity,
        LocalDateTime createdAt
) {
}