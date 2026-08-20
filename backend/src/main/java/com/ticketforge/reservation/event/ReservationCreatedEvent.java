package com.ticketforge.reservation.event;

import java.time.LocalDateTime;

public record ReservationCreatedEvent(
        Long reservationId,
        Long eventId,
        Integer quantity,
        LocalDateTime createdAt
) {
}
