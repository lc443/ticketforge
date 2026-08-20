package com.ticketforge.reservation.repository;

import com.ticketforge.reservation.entity.OutboxEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent, Long> {

    // Oldest-first, capped batch: keeps one slow poll from trying to load
    // an unbounded backlog into memory if publishing has been stuck.
    List<OutboxEvent> findTop50ByPublishedFalseOrderByCreatedAtAsc();
}
