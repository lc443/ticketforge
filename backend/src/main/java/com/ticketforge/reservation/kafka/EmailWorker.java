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
public class EmailWorker {

    private static final String CONSUMER_NAME = "email-workers";

    private final ProcessedEventRepository processedEventRepository;

    @KafkaListener(
            topics = "reservation-created",
            groupId = CONSUMER_NAME
    )
    public void consume(
            ReservationCreatedEvent event
    ) {

        // Cheap fast path — skips most duplicate redeliveries (e.g. after a
        // consumer rebalance) without touching the unique constraint.
        if (processedEventRepository.existsByConsumerNameAndEventId(
                CONSUMER_NAME,
                event.reservationId()
        )) {
            System.out.println(
                    "EMAIL WORKER: duplicate delivery for reservation "
                            + event.reservationId()
                            + " — skipping"
            );
            return;
        }

        // The correctness guarantee — claim the (consumer, event) pair
        // atomically before doing anything with a side effect. If two
        // redeliveries race past the check above, only one insert wins;
        // the loser hits the unique constraint and backs off instead of
        // sending a duplicate email.
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
                    "EMAIL WORKER: lost the race on reservation "
                            + event.reservationId()
                            + " — already claimed, skipping"
            );
            return;
        }

        System.out.println(
                "EMAIL WORKER RECEIVED: " + event
        );
    }
}
