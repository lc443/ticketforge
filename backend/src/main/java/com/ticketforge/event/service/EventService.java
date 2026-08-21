package com.ticketforge.event.service;

import com.ticketforge.auth.entity.Role;
import com.ticketforge.auth.entity.User;
import com.ticketforge.auth.repository.UserRepository;
import com.ticketforge.event.dto.EventAuditResponse;
import com.ticketforge.event.dto.EventRequest;
import com.ticketforge.event.dto.EventResponse;
import com.ticketforge.event.entity.Event;
import com.ticketforge.event.entity.EventAudit;
import com.ticketforge.event.entity.EventAuditAction;
import com.ticketforge.event.entity.EventStatus;
import com.ticketforge.event.repository.EventAuditRepository;
import com.ticketforge.event.repository.EventRepository;
import com.ticketforge.reservation.repository.ReservationRepository;
import com.ticketforge.shared.error.ConflictException;
import com.ticketforge.shared.error.ForbiddenException;
import com.ticketforge.shared.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventAuditRepository eventAuditRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    @Transactional
    public EventResponse create(EventRequest request, String actorEmail) {
        User organizer = requireUser(actorEmail);
        Event event = Event.builder()
                .name(request.name().trim())
                .venue(request.venue().trim())
                .eventDate(request.eventDate())
                .totalTickets(request.totalTickets())
                .availableTickets(request.totalTickets())
                .status(EventStatus.SCHEDULED)
                .organizer(organizer)
                .build();
        Event saved = eventRepository.saveAndFlush(event);
        recordAudit(saved.getId(), EventAuditAction.CREATED, actorEmail,
                "Created scheduled event with capacity " + saved.getTotalTickets() + ".");
        return EventResponse.from(saved);
    }

    public List<EventResponse> findAll() {
        return eventRepository.findAll().stream().map(EventResponse::from).toList();
    }

    @Cacheable(value = "events-v2", key = "#id")
    public EventResponse findById(Long id) {
        return EventResponse.from(findEvent(id));
    }

    @Transactional
    @CachePut(value = "events-v2", key = "#id")
    public EventResponse update(Long id, EventRequest request, String actorEmail) {
        Event event = eventRepository.findWithLockById(id)
                .orElseThrow(() -> new NotFoundException("Event " + id + " was not found."));
        authorizeManagement(event, actorEmail);

        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new ConflictException("Cancelled events cannot be edited.");
        }

        if (request.version() != null && !request.version().equals(event.getVersion())) {
            throw new ConflictException(
                    "This event changed after you opened it. Reload the event before saving."
            );
        }

        int soldTickets = event.getTotalTickets() - event.getAvailableTickets();
        if (request.totalTickets() < soldTickets) {
            throw new ConflictException(
                    "Total tickets cannot be lower than the " + soldTickets + " tickets already sold."
            );
        }

        event.setName(request.name().trim());
        event.setVenue(request.venue().trim());
        event.setEventDate(request.eventDate());
        event.setTotalTickets(request.totalTickets());
        event.setAvailableTickets(request.totalTickets() - soldTickets);
        Event saved = eventRepository.saveAndFlush(event);
        recordAudit(id, EventAuditAction.UPDATED, actorEmail,
                "Updated event details; sold tickets preserved at " + soldTickets + ".");
        return EventResponse.from(saved);
    }

    @Transactional
    @CachePut(value = "events-v2", key = "#id")
    public EventResponse updateStatus(Long id, EventStatus requestedStatus, String actorEmail) {
        Event event = eventRepository.findWithLockById(id)
                .orElseThrow(() -> new NotFoundException("Event " + id + " was not found."));
        authorizeManagement(event, actorEmail);

        EventStatus currentStatus = normalizedStatus(event);
        if (currentStatus == requestedStatus) {
            return EventResponse.from(event);
        }
        if (currentStatus != EventStatus.SCHEDULED || requestedStatus != EventStatus.CANCELLED) {
            throw new ConflictException(
                    "Event status cannot transition from " + currentStatus + " to " + requestedStatus + "."
            );
        }

        event.setStatus(EventStatus.CANCELLED);
        Event saved = eventRepository.saveAndFlush(event);
        recordAudit(id, EventAuditAction.CANCELLED, actorEmail,
                "Cancelled event; reservation and inventory history preserved.");
        return EventResponse.from(saved);
    }

    @Transactional
    @CacheEvict(value = "events-v2", key = "#id")
    public void delete(Long id, String actorEmail) {
        Event event = eventRepository.findWithLockById(id)
                .orElseThrow(() -> new NotFoundException("Event " + id + " was not found."));
        authorizeManagement(event, actorEmail);

        if (reservationRepository.existsByEventId(id)) {
            throw new ConflictException(
                    "Event " + id + " has reservations and must be cancelled instead of deleted."
            );
        }

        recordAudit(id, EventAuditAction.DELETED, actorEmail,
                "Hard-deleted event without reservations.");
        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public List<EventAuditResponse> audit(Long id, String actorEmail) {
        Event event = findEvent(id);
        authorizeManagement(event, actorEmail);
        return eventAuditRepository.findByEventIdOrderByOccurredAtDesc(id).stream()
                .map(EventAuditResponse::from)
                .toList();
    }

    private Event findEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event " + id + " was not found."));
    }

    private User requireUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Authenticated user was not found."));
    }

    private void authorizeManagement(Event event, String actorEmail) {
        User actor = requireUser(actorEmail);
        if (actor.getRole() == Role.ADMIN) {
            return;
        }
        if (event.getOrganizer() == null) {
            throw new ConflictException(
                    "This legacy event has no organizer. Assign an owner before managing it."
            );
        }
        if (!event.getOrganizer().getId().equals(actor.getId())) {
            throw new ForbiddenException("Only the event organizer can manage this event.");
        }
    }

    private EventStatus normalizedStatus(Event event) {
        return event.getStatus() == null ? EventStatus.SCHEDULED : event.getStatus();
    }

    private void recordAudit(
            Long eventId,
            EventAuditAction action,
            String actorEmail,
            String details
    ) {
        eventAuditRepository.save(EventAudit.builder()
                .eventId(eventId)
                .action(action)
                .actorEmail(actorEmail)
                .occurredAt(LocalDateTime.now())
                .details(details)
                .build());
    }
}
