package com.ticketforge.shared.config;

import com.ticketforge.auth.security.JwtAuthenticationFilter;
import com.ticketforge.shared.ratelimit.RateLimitFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitFilter rateLimitFilter;

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/actuator/**"
                        )
                        .permitAll()
                        .anyRequest()
                        .authenticated()
                )

                // Rate limiting runs first
                .addFilterBefore(
                        rateLimitFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                // JWT validation runs after rate limiting,
                // but still before Spring's username/password filter
                .addFilterAfter(
                        jwtAuthenticationFilter,
                        RateLimitFilter.class
                );

        return http.build();
    }
}