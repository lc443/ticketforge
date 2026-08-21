package com.ticketforge.event.dto;

import com.ticketforge.event.entity.EventAudit;
import com.ticketforge.event.entity.EventAuditAction;

import java.time.LocalDateTime;

public record EventAuditResponse(
        Long id,
        EventAuditAction action,
        String actorEmail,
        LocalDateTime occurredAt,
        String details
) {
    public static EventAuditResponse from(EventAudit audit) {
        return new EventAuditResponse(
                audit.getId(), audit.getAction(), audit.getActorEmail(),
                audit.getOccurredAt(), audit.getDetails()
        );
    }
}
