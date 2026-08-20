package com.ticketforge.reservation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Idempotency marker for Kafka consumers. Kafka guarantees at-least-once
// delivery — a rebalance, a retry, or a redelivery after a slow consumer
// can hand the same event to a worker more than once. One row per
// (consumer, event) pair, enforced by a unique constraint, is what makes
// "processed twice" impossible instead of just unlikely.
@Entity
@Table(
        name = "processed_events",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_processed_event_consumer_event",
                columnNames = {"consumer_name", "event_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessedEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "consumer_name", nullable = false)
    private String consumerName;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt;
}
