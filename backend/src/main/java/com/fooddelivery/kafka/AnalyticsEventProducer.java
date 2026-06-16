package com.fooddelivery.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class AnalyticsEventProducer {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsEventProducer.class);
    private static final String ANALYTICS_TOPIC = "analytics";

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public AnalyticsEventProducer(KafkaTemplate<String, Object> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishEvent(AnalyticsEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            String key = event.getEventType().name();
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(ANALYTICS_TOPIC, key, payload);
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Analytics event published to topic {}: eventType={}, entityId={}, offset={}",
                            ANALYTICS_TOPIC, event.getEventType(), event.getEntityId(), result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish analytics event: eventType={}, entityId={}",
                            event.getEventType(), event.getEntityId(), ex);
                }
            });
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize AnalyticsEvent: eventType={}", event.getEventType(), e);
            throw new RuntimeException("Failed to serialize AnalyticsEvent", e);
        }
    }
}
