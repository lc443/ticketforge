package com.ticketforge.event.repository;

import com.ticketforge.event.entity.Event;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Override
    @EntityGraph(attributePaths = "organizer")
    List<Event> findAll();

    @Override
    @EntityGraph(attributePaths = "organizer")
    Optional<Event> findById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = "organizer")
    Optional<Event> findWithLockById(Long id);
}
