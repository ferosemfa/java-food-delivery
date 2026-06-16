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
public class NotificationEventProducer {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventProducer.class);
    private static final String NOTIFICATIONS_TOPIC = "notifications";

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public NotificationEventProducer(KafkaTemplate<String, Object> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishNotification(NotificationEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            String key = event.getUserId() != null ? event.getUserId().toString() : event.getNotificationId().toString();
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(NOTIFICATIONS_TOPIC, key, payload);
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Notification event published to topic {}: notificationId={}, userId={}, channel={}, type={}, offset={}",
                            NOTIFICATIONS_TOPIC, event.getNotificationId(), event.getUserId(),
                            event.getChannel(), event.getType(), result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish notification event: notificationId={}, userId={}",
                            event.getNotificationId(), event.getUserId(), ex);
                }
            });
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize NotificationEvent: notificationId={}", event.getNotificationId(), e);
            throw new RuntimeException("Failed to serialize NotificationEvent", e);
        }
    }
}
