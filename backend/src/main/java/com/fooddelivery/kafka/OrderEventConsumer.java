package com.fooddelivery.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fooddelivery.model.Order;
import com.fooddelivery.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrderEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);

    private final ObjectMapper objectMapper;
    private final OrderRepository orderRepository;

    public OrderEventConsumer(ObjectMapper objectMapper, OrderRepository orderRepository) {
        this.objectMapper = objectMapper;
        this.orderRepository = orderRepository;
    }

    @KafkaListener(topics = "new-orders", groupId = "${spring.kafka.consumer.group-id}", concurrency = "3")
    public void consumeNewOrder(@Payload String message,
                                @Header(KafkaHeaders.RECEIVED_KEY) String key,
                                @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                @Header(KafkaHeaders.OFFSET) long offset,
                                Acknowledgment ack) {
        try {
            OrderEvent event = objectMapper.readValue(message, OrderEvent.class);
            log.info("Received new order event: orderId={}, customerId={}, vendorId={}, amount={}, partition={}, offset={}",
                    event.getOrderId(), event.getCustomerId(), event.getVendorId(),
                    event.getTotalAmount(), partition, offset);

            Optional<Order> existingOrder = orderRepository.findById(event.getOrderId());
            if (existingOrder.isPresent()) {
                Order order = existingOrder.get();
                if ("PENDING".equals(order.getStatus()) || "RECEIVED".equals(order.getStatus())) {
                    order.setStatus("RECEIVED");
                    order.setUpdatedAt(Instant.now());
                    orderRepository.save(order);
                    log.info("Order status updated to RECEIVED: orderId={}", event.getOrderId());
                }
            } else {
                log.warn("Order not found in DB for orderId={}, skipping status update", event.getOrderId());
            }

            ack.acknowledge();
        } catch (Exception e) {
            log.error("Error processing new order event: key={}, message={}", key, message, e);
            ack.acknowledge();
        }
    }

    @KafkaListener(topics = "order-updates", groupId = "${spring.kafka.consumer.group-id}", concurrency = "3")
    public void consumeOrderUpdate(@Payload String message,
                                   @Header(KafkaHeaders.RECEIVED_KEY) String key,
                                   @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                   @Header(KafkaHeaders.OFFSET) long offset,
                                   Acknowledgment ack) {
        try {
            OrderEvent event = objectMapper.readValue(message, OrderEvent.class);
            log.info("Received order update event: orderId={}, newStatus={}, partition={}, offset={}",
                    event.getOrderId(), event.getStatus(), partition, offset);

            Optional<Order> existingOrder = orderRepository.findById(event.getOrderId());
            if (existingOrder.isPresent()) {
                Order order = existingOrder.get();
                String currentStatus = order.getStatus();
                String newStatus = event.getStatus();

                if (isValidTransition(currentStatus, newStatus)) {
                    order.setStatus(newStatus);
                    order.setUpdatedAt(Instant.now());
                    orderRepository.save(order);
                    log.info("Order status transitioned: orderId={}, from={}, to={}",
                            event.getOrderId(), currentStatus, newStatus);
                } else {
                    log.warn("Invalid status transition: orderId={}, from={}, to={}",
                            event.getOrderId(), currentStatus, newStatus);
                }
            } else {
                log.warn("Order not found for update: orderId={}", event.getOrderId());
            }

            ack.acknowledge();
        } catch (Exception e) {
            log.error("Error processing order update event: key={}, message={}", key, message, e);
            ack.acknowledge();
        }
    }

    private boolean isValidTransition(String current, String next) {
        if (current == null || next == null) return false;
        return switch (current.toUpperCase()) {
            case "RECEIVED" -> "PREPARING".equalsIgnoreCase(next);
            case "PREPARING" -> "OUT_FOR_DELIVERY".equalsIgnoreCase(next);
            case "OUT_FOR_DELIVERY" -> "DELIVERED".equalsIgnoreCase(next);
            default -> false;
        };
    }
}
