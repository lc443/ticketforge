package com.ticketforge.reservation.controller;

import com.ticketforge.reservation.dto.MyReservationResponse;
import com.ticketforge.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class MyReservationController {

    private final ReservationService reservationService;

    @GetMapping("/mine")
    public List<MyReservationResponse> findMine(Principal principal) {
        return reservationService.findMine(principal.getName());
    }
}
