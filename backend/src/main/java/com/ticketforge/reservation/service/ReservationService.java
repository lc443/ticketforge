package com.ticketforge.reservation.service;

import com.ticketforge.auth.entity.User;
import com.ticketforge.auth.repository.UserRepository;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import com.ticketforge.event.entity.Event;
import com.ticketforge.event.repository.EventRepository;
import com.ticketforge.reservation.dto.CreateReservationRequest;
import com.ticketforge.reservation.dto.ReservationResponse;
import com.ticketforge.reservation.dto.MyReservationResponse;
import com.ticketforge.reservation.entity.OutboxEvent;
import com.ticketforge.reservation.entity.Reservation;
import com.ticketforge.reservation.entity.ReservationStatus;
import com.ticketforge.reservation.event.ReservationCreatedEvent;
import com.ticketforge.reservation.repository.OutboxEventRepository;
import com.ticketforge.reservation.repository.ReservationRepository;
import com.ticketforge.shared.error.ConflictException;
import com.ticketforge.shared.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private static final String RESERVATION_CREATED_TOPIC = "reservation-created";

    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final OutboxEventRepository outboxEventRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    @Transactional
    @CacheEvict(value = "events", key = "#eventId")
    public ReservationResponse createReservation(
            Long eventId,
            CreateReservationRequest request,
            String userEmail
    ) {
       User user = userRepository.findByEmail(userEmail)
               .orElseThrow(() -> new NotFoundException("Authenticated user was not found."));

       Event event = eventRepository.findWithLockById(eventId)
        .orElseThrow(() -> new NotFoundException("Event " + eventId + " was not found."));

        if (event.getAvailableTickets() < request.quantity()) {
            throw new ConflictException(
                    "Only " + event.getAvailableTickets() + " tickets are available."
            );
        }

        event.setAvailableTickets(
                event.getAvailableTickets() - request.quantity()
        );

        Reservation reservation = Reservation.builder()
                .event(event)
                .user(user)
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

    @Transactional(readOnly = true)
    public List<MyReservationResponse> findMine(String userEmail) {
        return reservationRepository.findMine(userEmail).stream()
                .map(reservation -> new MyReservationResponse(
                        reservation.getId(),
                        reservation.getEvent().getId(),
                        reservation.getEvent().getName(),
                        reservation.getEvent().getVenue(),
                        reservation.getEvent().getEventDate(),
                        reservation.getQuantity(),
                        reservation.getStatus(),
                        reservation.getReservedAt()
                ))
                .toList();
    }

    private String writeValueAsString(
            ReservationCreatedEvent reservationCreatedEvent
    ) {
        try {
            return objectMapper.writeValueAsString(reservationCreatedEvent);
        } catch (JacksonException e) {
            throw new IllegalStateException(
                    "Failed to serialize " + reservationCreatedEvent,
                    e
            );
        }
    }
}
