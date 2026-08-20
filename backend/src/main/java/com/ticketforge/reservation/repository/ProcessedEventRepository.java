package com.ticketforge.reservation.repository;

import com.ticketforge.reservation.entity.ProcessedEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, Long> {

    boolean existsByConsumerNameAndEventId(String consumerName, Long eventId);
}
