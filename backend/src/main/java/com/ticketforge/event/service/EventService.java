package com.ticketforge.event.service;

import com.ticketforge.event.dto.EventRequest;
import com.ticketforge.event.entity.Event;
import com.ticketforge.event.repository.EventRepository;
import com.ticketforge.reservation.repository.ReservationRepository;
import com.ticketforge.shared.error.ConflictException;
import com.ticketforge.shared.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ReservationRepository reservationRepository;

    public Event create(EventRequest request) {
        Event event = Event.builder()
                .name(request.name().trim())
                .venue(request.venue().trim())
                .eventDate(request.eventDate())
                .totalTickets(request.totalTickets())
                .availableTickets(request.totalTickets())
                .build();
        return eventRepository.save(event);
    }

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    @Cacheable(value = "events", key = "#id")
    public Event findById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Event " + id + " was not found."));
    }

    @Transactional
    @CachePut(value = "events", key = "#id")
    public Event update(Long id, EventRequest request) {
        Event event = eventRepository.findWithLockById(id)
                .orElseThrow(() -> new NotFoundException("Event " + id + " was not found."));

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
        return eventRepository.save(event);
    }

    @Transactional
    @CacheEvict(value = "events", key = "#id")
    public void delete(Long id) {
        Event event = eventRepository.findWithLockById(id)
                .orElseThrow(() -> new NotFoundException("Event " + id + " was not found."));

        if (reservationRepository.existsByEventId(id)) {
            throw new ConflictException(
                    "Event " + id + " cannot be deleted because it has reservations."
            );
        }

        eventRepository.delete(event);
    }
}
