package com.ticketforge.event.service;

import com.ticketforge.event.dto.EventRequest;
import com.ticketforge.event.entity.Event;
import com.ticketforge.event.repository.EventRepository;
import com.ticketforge.reservation.repository.ReservationRepository;
import com.ticketforge.shared.error.ConflictException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void updatePreservesTicketsAlreadySold() {
        Event event = event(100, 80);
        EventRequest request = request(120);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(eventRepository.save(event)).thenReturn(event);

        Event updated = eventService.update(1L, request);

        assertEquals(120, updated.getTotalTickets());
        assertEquals(100, updated.getAvailableTickets());
    }

    @Test
    void updateRejectsCapacityBelowTicketsAlreadySold() {
        Event event = event(100, 80);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));

        ConflictException exception = assertThrows(
                ConflictException.class,
                () -> eventService.update(1L, request(19))
        );

        assertEquals(
                "Total tickets cannot be lower than the 20 tickets already sold.",
                exception.getMessage()
        );
        verify(eventRepository, never()).save(event);
    }

    @Test
    void deleteRejectsAnEventWithReservations() {
        Event event = event(100, 80);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(reservationRepository.existsByEventId(1L)).thenReturn(true);

        ConflictException exception = assertThrows(
                ConflictException.class,
                () -> eventService.delete(1L)
        );

        assertEquals("Event 1 cannot be deleted because it has reservations.", exception.getMessage());
        verify(eventRepository, never()).delete(event);
    }

    @Test
    void deleteRemovesAnEventWithoutReservations() {
        Event event = event(100, 100);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(reservationRepository.existsByEventId(1L)).thenReturn(false);

        eventService.delete(1L);

        verify(eventRepository).delete(event);
    }

    private Event event(int totalTickets, int availableTickets) {
        return Event.builder()
                .id(1L)
                .name("TicketForge Live")
                .venue("Architecture Lab")
                .eventDate(LocalDateTime.of(2026, 9, 1, 19, 0))
                .totalTickets(totalTickets)
                .availableTickets(availableTickets)
                .build();
    }

    private EventRequest request(int totalTickets) {
        return new EventRequest(
                "TicketForge Live Updated",
                "Main Hall",
                LocalDateTime.of(2026, 9, 2, 20, 0),
                totalTickets
        );
    }
}
