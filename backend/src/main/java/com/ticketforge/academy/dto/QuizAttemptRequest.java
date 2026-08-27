package com.ticketforge.academy.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record QuizAttemptRequest(
        @Min(0) int correctAnswers,
        @Min(1) @Max(100) int totalQuestions
) {}
