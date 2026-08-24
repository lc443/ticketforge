package com.ticketforge.academy.dto;

import java.time.Instant;

public record QuizAttemptResponse(
        Long id, String moduleId, int correctAnswers, int totalQuestions,
        int scorePercent, boolean passed, Instant submittedAt
) {}
