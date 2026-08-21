package com.ticketforge.reservation.repository;

import com.ticketforge.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
            select r from Reservation r
            join fetch r.event
            where r.user.email = :email
            order by r.reservedAt desc
            """)
    List<Reservation> findMine(@Param("email") String email);
}
