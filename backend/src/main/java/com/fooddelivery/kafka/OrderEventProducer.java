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
public class OrderEventProducer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventProducer.class);
    private static final String NEW_ORDERS_TOPIC = "new-orders";
    private static final String ORDER_UPDATES_TOPIC = "order-updates";

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public OrderEventProducer(KafkaTemplate<String, Object> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishNewOrder(OrderEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(NEW_ORDERS_TOPIC, event.getOrderId().toString(), payload);
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("New order event published to topic {}: orderId={}, offset={}",
                            NEW_ORDERS_TOPIC, event.getOrderId(), result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish new order event for orderId={}", event.getOrderId(), ex);
                }
            });
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize OrderEvent for orderId={}", event.getOrderId(), e);
            throw new RuntimeException("Failed to serialize OrderEvent", e);
        }
    }

    public void publishOrderUpdate(OrderEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(ORDER_UPDATES_TOPIC, event.getOrderId().toString(), payload);
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Order update event published to topic {}: orderId={}, status={}, offset={}",
                            ORDER_UPDATES_TOPIC, event.getOrderId(), event.getStatus(), result.getRecordMetadata().offset());
                } else {
                    log.error("Failed to publish order update event for orderId={}", event.getOrderId(), ex);
                }
            });
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize OrderUpdate event for orderId={}", event.getOrderId(), e);
            throw new RuntimeException("Failed to serialize OrderUpdate event", e);
        }
    }
}
