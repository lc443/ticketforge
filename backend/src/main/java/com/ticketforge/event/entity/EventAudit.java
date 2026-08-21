package com.ticketforge.event.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_audits", indexes = @Index(name = "idx_event_audits_event_id", columnList = "event_id"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventAuditAction action;

    @Column(nullable = false)
    private String actorEmail;

    @Column(nullable = false)
    private LocalDateTime occurredAt;

    @Column(nullable = false, length = 1000)
    private String details;
}
