package com.ticketforge.reservation.service;

import com.ticketforge.event.entity.Event;
import com.ticketforge.event.repository.EventRepository;
import com.ticketforge.reservation.dto.CreateReservationRequest;
import com.ticketforge.reservation.dto.ReservationResponse;
import com.ticketforge.reservation.entity.Reservation;
import com.ticketforge.reservation.entity.ReservationStatus;
import com.ticketforge.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;

    @Transactional
    public ReservationResponse createReservation(
            UUID eventId,
            CreateReservationRequest request
    ) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getAvailableTickets() < request.quantity()) {
            throw new RuntimeException("Not enough tickets available");
        }

        event.setAvailableTickets(
                event.getAvailableTickets() - request.quantity()
        );

        Reservation reservation = Reservation.builder()
                .event(event)
                .quantity(request.quantity())
                .status(ReservationStatus.PENDING)
                .reservedAt(LocalDateTime.now())
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        return new ReservationResponse(
                savedReservation.getId(),
                event.getId(),
                savedReservation.getQuantity(),
                savedReservation.getStatus(),
                savedReservation.getReservedAt()
        );
    }
}