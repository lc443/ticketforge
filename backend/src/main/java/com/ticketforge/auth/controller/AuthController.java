package com.ticketforge.auth.controller;

import com.ticketforge.auth.dto.AuthResponse;
import com.ticketforge.auth.dto.LoginRequest;
import com.ticketforge.auth.dto.RegisterRequest;
import com.ticketforge.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(
            @RequestBody RegisterRequest request
    ) {
        authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }
}