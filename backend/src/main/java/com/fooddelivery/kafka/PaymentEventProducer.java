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
public class PaymentEventProducer {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventProducer.class);
    private static final String PAYMENT_EVENTS_TOPIC = "payment-events";

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public PaymentEventProducer(KafkaTemplate<String, Object> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishPaymentEvent(PaymentEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                    PAYMENT_EVENTS_TOPIC, event.getOrderId().toString(), payload);
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Payment event published to topic {}: paymentId={}, orderId={}, status={}, offset={}",
                            PAYMENT_EVENTS_TOPIC, event.getPaymentId(), event.getOrderId(),
                            event.getStatus(), result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish payment event: paymentId={}, orderId={}",
                            event.getPaymentId(), event.getOrderId(), ex);
                }
            });
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize PaymentEvent: paymentId={}", event.getPaymentId(), e);
            throw new RuntimeException("Failed to serialize PaymentEvent", e);
        }
    }
}
