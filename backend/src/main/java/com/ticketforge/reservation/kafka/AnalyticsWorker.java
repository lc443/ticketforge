package com.ticketforge.reservation.kafka;

import com.ticketforge.reservation.entity.ProcessedEvent;
import com.ticketforge.reservation.event.ReservationCreatedEvent;
import com.ticketforge.reservation.repository.ProcessedEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AnalyticsWorker {

    private static final String CONSUMER_NAME = "analytics-workers";

    private final ProcessedEventRepository processedEventRepository;

    @KafkaListener(
            topics = "reservation-created",
            groupId = CONSUMER_NAME
    )
    public void consume(
            ReservationCreatedEvent event
    ) {

        if (processedEventRepository.existsByConsumerNameAndEventId(
                CONSUMER_NAME,
                event.reservationId()
        )) {
            System.out.println(
                    "ANALYTICS WORKER: duplicate delivery for reservation "
                            + event.reservationId()
                            + " — skipping"
            );
            return;
        }

        try {
            processedEventRepository.saveAndFlush(
                    ProcessedEvent.builder()
                            .consumerName(CONSUMER_NAME)
                            .eventId(event.reservationId())
                            .processedAt(LocalDateTime.now())
                            .build()
            );
        } catch (DataIntegrityViolationException e) {
            System.out.println(
                    "ANALYTICS WORKER: lost the race on reservation "
                            + event.reservationId()
                            + " — already claimed, skipping"
            );
            return;
        }

        System.out.println(
                "ANALYTICS WORKER RECEIVED: "
                        + event
        );
    }
}
