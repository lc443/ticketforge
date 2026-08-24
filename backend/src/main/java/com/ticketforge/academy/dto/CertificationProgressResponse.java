package com.ticketforge.academy.dto;

import java.util.List;

public record CertificationProgressResponse(
        String certificationId,
        String learnerEmail,
        int completedExercises,
        int requiredExercises,
        int progressPercent,
        List<ExerciseProgressResponse> exercises,
        CertificateResponse certificate
) {}
