package com.ticketforge.shared.cache;

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

// @EnableCaching turns @Cacheable on, but says nothing about HOW to turn a
// cached object into bytes for Redis. Spring's fallback for that is JDK
// serialization, which requires the cached class to implement Serializable
// — Event doesn't, and neither will most JPA entities (Hibernate proxies
// don't serialize cleanly with plain Java serialization anyway). Without
// this bean, RedisCacheManager ends up with no usable value serializer at
// all, and the very first cache write throws.
//
// Defining the RedisCacheManager bean directly here — rather than reaching
// for Spring Boot's RedisCacheManagerBuilderCustomizer — keeps this to
// core spring-data-redis classes only. That customizer interface lives in
// spring-boot-autoconfigure and has moved packages across Boot versions;
// building the CacheManager ourselves sidesteps that entirely, and Spring
// Boot's own Redis cache autoconfiguration backs off automatically once a
// CacheManager bean already exists in the context.
//
// GenericJackson2JsonRedisSerializer stores values as JSON instead of
// requiring Serializable — human-readable in Redis, and its default
// constructor registers Jackson's classpath modules itself, including the
// JSR-310 module this app already relies on for LocalDateTime fields.
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        GenericJackson2JsonRedisSerializer serializer =
                new GenericJackson2JsonRedisSerializer()
                        .configure(mapper -> mapper.registerModule(new JavaTimeModule()));

        RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(
                        RedisSerializationContext.SerializationPair.fromSerializer(
                                serializer
                        )
                );

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(configuration)
                .build();
    }
}
