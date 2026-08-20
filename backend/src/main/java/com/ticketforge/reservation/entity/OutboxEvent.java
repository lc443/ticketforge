package com.ticketforge.reservation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// The transactional outbox. Written in the SAME @Transactional method — and
// therefore the same database transaction — as the business row it describes
// (e.g. a Reservation). Postgres guarantees both rows commit together or
// neither does, which is a guarantee no amount of try/catch around a Kafka
// call can give you: the database and the message broker are two separate
// systems with two separate commit protocols, and you can't make one
// transaction span both.
//
// A separate poller (OutboxPublisher) reads unpublished rows and actually
// sends them to Kafka, on its own schedule, after the transaction above has
// already safely committed.
@Entity
@Table(name = "outbox_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OutboxEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // What topic this row should be published to.
    @Column(nullable = false)
    private String topic;

    // The Kafka message key (e.g. the reservation ID), so ordering per
    // aggregate is preserved the same way it would be with a direct send.
    // Stored as a String because that's what the Kafka key serializer
    // wants — it's a stringified Long now, same as it was a stringified
    // UUID before.
    @Column(name = "message_key", nullable = false)
    private String messageKey;

    // The event, already serialized to JSON at write time. The outbox row
    // doesn't depend on the producer or Kafka being reachable to exist.
    @Lob
    @Column(nullable = false)
    private String payload;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean published;

    private LocalDateTime publishedAt;
}
