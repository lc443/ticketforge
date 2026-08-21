package com.ticketforge.event.repository;

import com.ticketforge.event.entity.EventAudit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventAuditRepository extends JpaRepository<EventAudit, Long> {
    List<EventAudit> findByEventIdOrderByOccurredAtDesc(Long eventId);
}
