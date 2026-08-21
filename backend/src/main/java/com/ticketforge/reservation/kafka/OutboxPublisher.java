package com.ticketforge.reservation.kafka;

import tools.jackson.databind.ObjectMapper;
import com.ticketforge.reservation.entity.OutboxEvent;
import com.ticketforge.reservation.event.ReservationCreatedEvent;
import com.ticketforge.reservation.repository.OutboxEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

// Reads outbox rows the request thread already committed and actually sends
// them to Kafka. This runs completely outside the customer's request — the
// reservation succeeded and returned a response well before this ever fires.
//
// Deliberately reuses the same KafkaTemplate<String, ReservationCreatedEvent>
// + JsonSerializer path the old ReservationProducer used, by deserializing
// the outbox's stored JSON back into the typed event before sending. That
// keeps the __TypeId__ header JsonSerializer adds intact, which is what lets
// EmailWorker/AnalyticsWorker's JsonDeserializer figure out what class to
// build. Sending the raw JSON string instead — through a plain
// KafkaTemplate<String, String> — would drop that header and send every
// message straight to the DLQ.
//
// If this crashes after Kafka has acked a send but before the row is marked
// published, the next poll resends it — a duplicate delivery. That's fine:
// EmailWorker and AnalyticsWorker are idempotent (Sprint 13), so a duplicate
// delivery is a no-op downstream instead of a duplicate email or double-
// counted sale. The outbox trades "might publish twice" for "will never
// silently lose an event," and idempotent consumers make that trade free.
@Component
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisher {

    private final OutboxEventRepository outboxEventRepository;
    private final KafkaTemplate<String, ReservationCreatedEvent> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Scheduled(fixedDelay = 2000)
    public void publishPending() {
        List<OutboxEvent> pending =
                outboxEventRepository.findTop50ByPublishedFalseOrderByCreatedAtAsc();

        for (OutboxEvent event : pending) {
            publishOne(event);
        }
    }

    private void publishOne(OutboxEvent event) {
        try {
            ReservationCreatedEvent payload = objectMapper.readValue(
                    event.getPayload(),
                    ReservationCreatedEvent.class
            );

            // .get() makes this a blocking send: we want to know the
            // broker actually acked it before marking the row published.
            // A batch of 50 sent one at a time is a deliberate simplicity
            // trade-off — correctness over throughput for a learning build.
            kafkaTemplate
                    .send(event.getTopic(), event.getMessageKey(), payload)
                    .get();

            event.setPublished(true);
            event.setPublishedAt(LocalDateTime.now());
            outboxEventRepository.save(event);
        } catch (Exception e) {
            // Leave it unpublished. The next poll retries it — no DLQ here
            // because this is infrastructure sending our own already-
            // durable event, not a consumer processing someone else's.
            log.warn(
                    "Failed to publish outbox event {} to topic {}, will retry",
                    event.getId(),
                    event.getTopic(),
                    e
            );
        }
    }
}
