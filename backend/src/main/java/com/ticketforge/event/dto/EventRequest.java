package com.ticketforge.event.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EventRequest(
        @NotBlank(message = "is required")
        String name,

        @NotBlank(message = "is required")
        String venue,

        @NotNull(message = "is required")
        LocalDateTime eventDate,

        @NotNull(message = "is required")
        @Min(value = 1, message = "must be at least 1")
        Integer totalTickets,

        Long version
) {
}
