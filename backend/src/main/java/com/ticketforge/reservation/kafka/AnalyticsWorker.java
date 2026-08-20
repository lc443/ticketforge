package com.ticketforge.reservation.kafka;

import com.ticketforge.reservation.event.ReservationCreatedEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class AnalyticsWorker {

    @KafkaListener(
            topics = "reservation-created",
            groupId = "analytics-workers"
    )
    public void consume(
            ReservationCreatedEvent event
    ) {

        System.out.println(
                "ANALYTICS WORKER RECEIVED: "
                        + event
        );
    }
}