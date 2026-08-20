package com.ticketforge.reservation.kafka;

import com.ticketforge.reservation.event.ReservationCreatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationProducer {

    private static final String TOPIC = "reservation-created";

    private final KafkaTemplate<String, ReservationCreatedEvent> kafkaTemplate;

    public void publish(ReservationCreatedEvent event) {
        kafkaTemplate.send(
                TOPIC,
                event.reservationId().toString(),
                event
        );
    }
}