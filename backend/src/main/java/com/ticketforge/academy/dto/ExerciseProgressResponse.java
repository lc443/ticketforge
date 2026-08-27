package com.ticketforge.academy.dto;

import java.time.Instant;

public record ExerciseProgressResponse(
        String exerciseId,
        boolean completed,
        Instant firstCompletedAt,
        Instant lastCompletedAt,
        Instant updatedAt
) {}
