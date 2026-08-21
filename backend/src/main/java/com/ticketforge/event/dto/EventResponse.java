package com.ticketforge.event.dto;

import com.ticketforge.event.entity.Event;
import com.ticketforge.event.entity.EventStatus;

import java.time.LocalDateTime;

public record EventResponse(
        Long id,
        String name,
        String venue,
        LocalDateTime eventDate,
        Integer totalTickets,
        Integer availableTickets,
        EventStatus status,
        String organizerEmail,
        Long version
) {
    public static EventResponse from(Event event) {
        return new EventResponse(
                event.getId(),
                event.getName(),
                event.getVenue(),
                event.getEventDate(),
                event.getTotalTickets(),
                event.getAvailableTickets(),
                event.getStatus() == null ? EventStatus.SCHEDULED : event.getStatus(),
                event.getOrganizer() == null ? null : event.getOrganizer().getEmail(),
                event.getVersion()
        );
    }
}
