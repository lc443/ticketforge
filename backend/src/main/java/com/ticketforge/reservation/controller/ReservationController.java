package com.ticketforge.reservation.controller;

import com.ticketforge.reservation.dto.CreateReservationRequest;
import com.ticketforge.reservation.dto.ReservationResponse;
import com.ticketforge.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/events/{eventId}/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationResponse createReservation(
            @PathVariable Long eventId,
            @Valid @RequestBody CreateReservationRequest request,
            Principal principal
    ) {
        return reservationService.createReservation(eventId, request, principal.getName());
    }
}
