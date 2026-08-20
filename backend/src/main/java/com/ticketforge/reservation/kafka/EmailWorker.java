package com.ticketforge.reservation.kafka;

import com.ticketforge.reservation.event.ReservationCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class EmailWorker {

    @KafkaListener(
            topics = "reservation-created",
            groupId = "email-workers"
    )
    public void consume(
            ReservationCreatedEvent event
    ) {

        System.out.println(
                "EMAIL WORKER RECEIVED: " + event
        );
    }
}