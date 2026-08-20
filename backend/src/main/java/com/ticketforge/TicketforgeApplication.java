package com.ticketforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

// @EnableScheduling turns on Spring's @Scheduled support — needed for
// OutboxPublisher.publishPending() to actually fire on its fixedDelay.
// Without this, the annotation is silently ignored and nothing runs.
@SpringBootApplication
@EnableScheduling
public class TicketforgeApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketforgeApplication.class, args);
	}

}
