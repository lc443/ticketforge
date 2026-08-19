package com.ticketforge.auth.service;

import com.ticketforge.auth.dto.AuthResponse;
import com.ticketforge.auth.dto.LoginRequest;
import com.ticketforge.auth.dto.RegisterRequest;
import com.ticketforge.auth.entity.Role;
import com.ticketforge.auth.entity.User;
import com.ticketforge.auth.repository.UserRepository;
import com.ticketforge.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists.");
        }

        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(
                        passwordEncoder.encode(request.password())
                )
                .role(Role.USER)
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(
                        () -> new RuntimeException("Invalid credentials.")
                );

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword()
        )) {
            throw new RuntimeException("Invalid credentials.");
        }

        String token = jwtService.generateToken(
                user.getEmail()
        );

        return new AuthResponse(token);
    }
}