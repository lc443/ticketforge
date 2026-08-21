package com.ticketforge.event.controller;

import com.ticketforge.event.dto.EventRequest;
import com.ticketforge.event.dto.EventAuditResponse;
import com.ticketforge.event.dto.EventResponse;
import com.ticketforge.event.dto.EventStatusRequest;
import com.ticketforge.event.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EventResponse create(@Valid @RequestBody EventRequest request, Principal principal) {
        return eventService.create(request, principal.getName());
    }

    @GetMapping
    public List<EventResponse> findAll() {
        return eventService.findAll();
    }

    @GetMapping("/{id}")
    public EventResponse findById(@PathVariable Long id) {
        return eventService.findById(id);
    }

    @PutMapping("/{id}")
    public EventResponse update(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            Principal principal
    ) {
        return eventService.update(id, request, principal.getName());
    }

    @PatchMapping("/{id}/status")
    public EventResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody EventStatusRequest request,
            Principal principal
    ) {
        return eventService.updateStatus(id, request.status(), principal.getName());
    }

    @GetMapping("/{id}/audit")
    public List<EventAuditResponse> audit(@PathVariable Long id, Principal principal) {
        return eventService.audit(id, principal.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Principal principal) {
        eventService.delete(id, principal.getName());
    }
}
