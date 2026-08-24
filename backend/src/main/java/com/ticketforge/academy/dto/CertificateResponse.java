package com.ticketforge.academy.dto;

import java.time.Instant;

public record CertificateResponse(
        String certificateNumber,
        String title,
        String certificationId,
        Instant completedAt
) {}
