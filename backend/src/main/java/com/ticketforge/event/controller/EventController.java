package com.ticketforge.event.controller;

import com.ticketforge.event.entity.Event;
import com.ticketforge.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public Event create(@RequestBody Event event) {
        return eventService.create(event);
    }

    @GetMapping
    public List<Event> findAll() {
        return eventService.findAll();
    }

    @GetMapping("/{id}")
    public Event findById(@PathVariable UUID id) {
        return eventService.findById(id);
    }
}