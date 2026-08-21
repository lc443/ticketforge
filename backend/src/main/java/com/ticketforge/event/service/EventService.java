package com.ticketforge.event.service;

import com.ticketforge.event.entity.Event;
import com.ticketforge.event.repository.EventRepository;
import com.ticketforge.shared.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event create(Event event) {
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
}
