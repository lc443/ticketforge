package com.ticketforge.auth.dto;

public record LoginRequest(
        String email,
        String password
) {
}