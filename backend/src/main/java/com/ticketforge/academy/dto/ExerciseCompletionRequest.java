package com.ticketforge.academy.dto;

import jakarta.validation.constraints.NotNull;

public record ExerciseCompletionRequest(@NotNull Boolean completed) {}
