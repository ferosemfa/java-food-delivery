package com.fooddelivery.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
public class NotificationEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventConsumer.class);

    private final ObjectMapper objectMapper;

    public NotificationEventConsumer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "notifications", groupId = "${spring.kafka.consumer.group-id}", concurrency = "3")
    public void consumeNotification(@Payload String message,
                                    @Header(KafkaHeaders.RECEIVED_KEY) String key,
                                    @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                    @Header(KafkaHeaders.OFFSET) long offset,
                                    Acknowledgment ack) {
        try {
            NotificationEvent event = objectMapper.readValue(message, NotificationEvent.class);
            log.info("Received notification event: notificationId={}, userId={}, channel={}, type={}, partition={}, offset={}",
                    event.getNotificationId(), event.getUserId(), event.getChannel(), event.getType(), partition, offset);

            switch (event.getChannel()) {
                case EMAIL -> sendEmail(event);
                case SMS -> sendSms(event);
                case PUSH -> sendPushNotification(event);
                default -> log.warn("Unknown notification channel: {}", event.getChannel());
            }

            ack.acknowledge();
        } catch (Exception e) {
            log.error("Error processing notification event: key={}", key, e);
            ack.acknowledge();
        }
    }

    private void sendEmail(NotificationEvent event) {
        log.info("Sending EMAIL to={}, subject={}, body={}",
                event.getUserEmail(), event.getSubject(), truncateBody(event.getBody()));
    }

    private void sendSms(NotificationEvent event) {
        log.info("Sending SMS to={}, body={}",
                event.getUserPhone(), truncateBody(event.getBody()));
    }

    private void sendPushNotification(NotificationEvent event) {
        log.info("Sending PUSH notification to deviceToken={}, title={}, body={}",
                maskToken(event.getDeviceToken()), event.getSubject(), truncateBody(event.getBody()));
    }

    private String truncateBody(String body) {
        if (body == null) return null;
        return body.length() > 100 ? body.substring(0, 97) + "..." : body;
    }

    private String maskToken(String token) {
        if (token == null) return null;
        return token.length() > 8 ? token.substring(0, 4) + "****" + token.substring(token.length() - 4) : "****";
    }
}
