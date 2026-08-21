package com.ticketforge.shared.ratelimit;

import com.ticketforge.shared.error.ApiErrorWriter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;
    private final ApiErrorWriter apiErrorWriter;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (!request.getRequestURI().startsWith("/api/events")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = request.getRemoteAddr();

        if (!rateLimitService.isAllowed(clientIp)) {
            apiErrorWriter.write(
                    request, response, HttpStatus.TOO_MANY_REQUESTS,
                    "Rate limit exceeded. Try again in one minute."
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
