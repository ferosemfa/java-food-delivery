package com.fooddelivery.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaTopicConfig {

    static final int DEFAULT_PARTITIONS = 3;
    static final short REPLICATION_FACTOR = 1;

    @Bean
    public NewTopic newOrdersTopic() {
        return new NewTopic("new-orders", DEFAULT_PARTITIONS, REPLICATION_FACTOR);
    }

    @Bean
    public NewTopic orderUpdatesTopic() {
        return new NewTopic("order-updates", DEFAULT_PARTITIONS, REPLICATION_FACTOR);
    }

    @Bean
    public NewTopic notificationsTopic() {
        return new NewTopic("notifications", DEFAULT_PARTITIONS, REPLICATION_FACTOR);
    }

    @Bean
    public NewTopic analyticsTopic() {
        return new NewTopic("analytics", DEFAULT_PARTITIONS, REPLICATION_FACTOR);
    }
}
