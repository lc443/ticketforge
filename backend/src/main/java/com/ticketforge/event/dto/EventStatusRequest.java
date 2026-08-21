package com.ticketforge.event.dto;

import com.ticketforge.event.entity.EventStatus;
import jakarta.validation.constraints.NotNull;

public record EventStatusRequest(@NotNull EventStatus status) {
}
