package com.ticketforge.reservation.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ticketforge.event.entity.Event;
import com.ticketforge.event.repository.EventRepository;
import com.ticketforge.reservation.dto.CreateReservationRequest;
import com.ticketforge.reservation.dto.ReservationResponse;
import com.ticketforge.reservation.entity.OutboxEvent;
import com.ticketforge.reservation.entity.Reservation;
import com.ticketforge.reservation.entity.ReservationStatus;
import com.ticketforge.reservation.event.ReservationCreatedEvent;
import com.ticketforge.reservation.repository.OutboxEventRepository;
import com.ticketforge.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private static final String RESERVATION_CREATED_TOPIC = "reservation-created";

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ReservationResponse createReservation(
            Long eventId,
            CreateReservationRequest request
    ) {
       Event event = eventRepository.findWithLockById(eventId)
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

        // No Kafka call here. We write the event as a row in the SAME
        // transaction as the reservation above, so Postgres — not a
        // try/catch around a network call — is what guarantees the
        // reservation and its event either both commit or neither does.
        // A separate poller (OutboxPublisher) sends it to Kafka afterward.
        ReservationCreatedEvent reservationCreatedEvent = new ReservationCreatedEvent(
                savedReservation.getId(),
                event.getId(),
                savedReservation.getQuantity(),
                LocalDateTime.now()
        );

        outboxEventRepository.save(
                OutboxEvent.builder()
                        .topic(RESERVATION_CREATED_TOPIC)
                        .messageKey(savedReservation.getId().toString())
                        .payload(writeValueAsString(reservationCreatedEvent))
                        .createdAt(LocalDateTime.now())
                        .published(false)
                        .build()
        );

        return new ReservationResponse(
                savedReservation.getId(),
                event.getId(),
                savedReservation.getQuantity(),
                savedReservation.getStatus(),
                savedReservation.getReservedAt()
        );
    }

    private String writeValueAsString(ReservationCreatedEvent reservationCreatedEvent) {
        try {
            return objectMapper.writeValueAsString(reservationCreatedEvent);
        } catch (JsonProcessingException e) {
            // Serializing our own record to JSON failing means a
            // programming error (e.g. an unserializable field), not a
            // transient fault — fail the transaction rather than silently
            // dropping the event.
            throw new IllegalStateException("Failed to serialize " + reservationCreatedEvent, e);
        }
    }
}
