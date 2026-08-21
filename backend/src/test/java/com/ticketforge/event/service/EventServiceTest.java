package com.ticketforge.event.service;

import com.ticketforge.auth.entity.Role;
import com.ticketforge.auth.entity.User;
import com.ticketforge.auth.repository.UserRepository;
import com.ticketforge.event.dto.EventRequest;
import com.ticketforge.event.dto.EventResponse;
import com.ticketforge.event.entity.Event;
import com.ticketforge.event.entity.EventAuditAction;
import com.ticketforge.event.entity.EventStatus;
import com.ticketforge.event.repository.EventAuditRepository;
import com.ticketforge.event.repository.EventRepository;
import com.ticketforge.reservation.repository.ReservationRepository;
import com.ticketforge.shared.error.ConflictException;
import com.ticketforge.shared.error.ForbiddenException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    private static final String ALICE = "alice@example.com";
    private static final String BOB = "bob@example.com";

    @Mock private EventRepository eventRepository;
    @Mock private EventAuditRepository eventAuditRepository;
    @Mock private ReservationRepository reservationRepository;
    @Mock private UserRepository userRepository;
    @InjectMocks private EventService eventService;

    @Test
    void createAssignsAuthenticatedUserAsOrganizerAndAudits() {
        User alice = user(1L, ALICE, Role.USER);
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(alice));
        when(eventRepository.saveAndFlush(any(Event.class))).thenAnswer(invocation -> {
            Event event = invocation.getArgument(0);
            event.setId(10L);
            event.setVersion(0L);
            return event;
        });

        EventResponse response = eventService.create(request(100, null), ALICE);

        assertEquals(ALICE, response.organizerEmail());
        assertEquals(EventStatus.SCHEDULED, response.status());
        verify(eventAuditRepository).save(argThat(audit ->
                audit.getEventId().equals(10L)
                        && audit.getAction() == EventAuditAction.CREATED
                        && audit.getActorEmail().equals(ALICE)
        ));
    }

    @Test
    void nonOrganizerCannotUpdateEvent() {
        Event event = event(100, 100, user(1L, ALICE, Role.USER));
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(BOB)).thenReturn(Optional.of(user(2L, BOB, Role.USER)));

        ForbiddenException exception = assertThrows(
                ForbiddenException.class,
                () -> eventService.update(1L, request(120, 0L), BOB)
        );

        assertEquals("Only the event organizer can manage this event.", exception.getMessage());
        verify(eventRepository, never()).save(event);
    }

    @Test
    void legacyEventMustReceiveAnOwnerBeforeManagement() {
        Event event = event(100, 100, null);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(user(1L, ALICE, Role.USER)));

        ConflictException exception = assertThrows(
                ConflictException.class,
                () -> eventService.delete(1L, ALICE)
        );

        assertTrue(exception.getMessage().contains("legacy event has no organizer"));
    }

    @Test
    void updatePreservesTicketsAlreadySoldAndAudits() {
        User alice = user(1L, ALICE, Role.USER);
        Event event = event(100, 80, alice);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(alice));
        when(eventRepository.saveAndFlush(event)).thenReturn(event);

        EventResponse updated = eventService.update(1L, request(120, 0L), ALICE);

        assertEquals(120, updated.totalTickets());
        assertEquals(100, updated.availableTickets());
        verify(eventAuditRepository).save(argThat(audit -> audit.getAction() == EventAuditAction.UPDATED));
    }

    @Test
    void updateRejectsCapacityBelowTicketsAlreadySold() {
        User alice = user(1L, ALICE, Role.USER);
        Event event = event(100, 80, alice);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(alice));

        ConflictException exception = assertThrows(
                ConflictException.class,
                () -> eventService.update(1L, request(19, 0L), ALICE)
        );

        assertEquals("Total tickets cannot be lower than the 20 tickets already sold.", exception.getMessage());
        verify(eventRepository, never()).save(event);
    }

    @Test
    void staleUpdateIsRejectedBeforeOverwritingNewerData() {
        User alice = user(1L, ALICE, Role.USER);
        Event event = event(100, 100, alice);
        event.setVersion(3L);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(alice));

        ConflictException exception = assertThrows(
                ConflictException.class,
                () -> eventService.update(1L, request(120, 2L), ALICE)
        );

        assertTrue(exception.getMessage().contains("changed after you opened it"));
    }

    @Test
    void cancellationPreservesEventAndWritesAudit() {
        User alice = user(1L, ALICE, Role.USER);
        Event event = event(100, 80, alice);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(alice));
        when(eventRepository.saveAndFlush(event)).thenReturn(event);

        EventResponse cancelled = eventService.updateStatus(1L, EventStatus.CANCELLED, ALICE);

        assertEquals(EventStatus.CANCELLED, cancelled.status());
        verify(eventRepository, never()).delete(any());
        verify(eventAuditRepository).save(argThat(audit -> audit.getAction() == EventAuditAction.CANCELLED));
    }

    @Test
    void repeatingCancellationIsIdempotent() {
        User alice = user(1L, ALICE, Role.USER);
        Event event = event(100, 80, alice);
        event.setStatus(EventStatus.CANCELLED);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(alice));

        EventResponse response = eventService.updateStatus(1L, EventStatus.CANCELLED, ALICE);

        assertEquals(EventStatus.CANCELLED, response.status());
        verify(eventAuditRepository, never()).save(any());
    }

    @Test
    void deleteRejectsAnEventWithReservations() {
        User alice = user(1L, ALICE, Role.USER);
        Event event = event(100, 80, alice);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(alice));
        when(reservationRepository.existsByEventId(1L)).thenReturn(true);

        ConflictException exception = assertThrows(
                ConflictException.class,
                () -> eventService.delete(1L, ALICE)
        );

        assertTrue(exception.getMessage().contains("must be cancelled instead"));
        verify(eventRepository, never()).delete(event);
    }

    @Test
    void deleteRemovesUnreservedEventAndPreservesAudit() {
        User alice = user(1L, ALICE, Role.USER);
        Event event = event(100, 100, alice);
        when(eventRepository.findWithLockById(1L)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ALICE)).thenReturn(Optional.of(alice));
        when(reservationRepository.existsByEventId(1L)).thenReturn(false);

        eventService.delete(1L, ALICE);

        verify(eventAuditRepository).save(argThat(audit -> audit.getAction() == EventAuditAction.DELETED));
        verify(eventRepository).delete(event);
    }

    private Event event(int totalTickets, int availableTickets, User organizer) {
        return Event.builder()
                .id(1L).name("TicketForge Live").venue("Architecture Lab")
                .eventDate(LocalDateTime.of(2026, 9, 1, 19, 0))
                .totalTickets(totalTickets).availableTickets(availableTickets)
                .status(EventStatus.SCHEDULED).organizer(organizer).version(0L).build();
    }

    private User user(Long id, String email, Role role) {
        return User.builder().id(id).firstName("Test").lastName("User")
                .email(email).password("encoded").role(role).build();
    }

    private EventRequest request(int totalTickets, Long version) {
        return new EventRequest(
                "TicketForge Live Updated", "Main Hall",
                LocalDateTime.of(2026, 9, 2, 20, 0), totalTickets, version
        );
    }
}
