package com.ticketforge.reservation.kafka;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.common.TopicPartition;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration

@EnableKafka


@RequiredArgsConstructor
public class KafkaConfig {

    private final KafkaTemplate<Object, Object> kafkaTemplate;

    @Bean

    public DefaultErrorHandler errorHandler() {

        DeadLetterPublishingRecoverer recoverer =

                new DeadLetterPublishingRecoverer(

                        kafkaTemplate,

                        (record, exception) ->

                                new TopicPartition(

                                        "reservation-created-dlq",

                                        record.partition()

                                )

                );

        FixedBackOff backOff =

                new FixedBackOff(

                        5000L,

                        3

                );

        return new DefaultErrorHandler(

                recoverer,

                backOff

        );

    }

}