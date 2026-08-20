package com.ticketforge.event.service;

import com.ticketforge.event.entity.Event;
import com.ticketforge.event.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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
    public Event findById(UUID id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }
}