package com.ticketforge.shared.ratelimit;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private static final int LIMIT = 10;
    private static final Duration WINDOW = Duration.ofMinutes(1);

    private final StringRedisTemplate redisTemplate;

    public boolean isAllowed(String clientId) {

        String key = "rate-limit:" + clientId;

        Long count = redisTemplate.opsForValue().increment(key);

        if (count != null && count == 1) {
            redisTemplate.expire(key, WINDOW);
        }

        return count != null && count <= LIMIT;
    }
}