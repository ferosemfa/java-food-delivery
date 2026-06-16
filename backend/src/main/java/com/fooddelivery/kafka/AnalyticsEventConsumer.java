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

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class AnalyticsEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsEventConsumer.class);

    private final ObjectMapper objectMapper;

    private final AtomicInteger orderCount = new AtomicInteger(0);
    private final AtomicInteger cancelledOrderCount = new AtomicInteger(0);
    private final AtomicReference<Double> totalRevenue = new AtomicReference<>(0.0);
    private final Map<String, AtomicInteger> ordersByStatus = new ConcurrentHashMap<>();
    private final Map<String, AtomicInteger> eventsByType = new ConcurrentHashMap<>();
    private final Map<AnalyticsEvent.EventType, AtomicInteger> eventTypeCounts = new ConcurrentHashMap<>();

    public AnalyticsEventConsumer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "analytics", groupId = "${spring.kafka.consumer.group-id}", concurrency = "3")
    public void consumeAnalyticsEvent(@Payload String message,
                                      @Header(KafkaHeaders.RECEIVED_KEY) String key,
                                      @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                      @Header(KafkaHeaders.OFFSET) long offset,
                                      Acknowledgment ack) {
        try {
            AnalyticsEvent event = objectMapper.readValue(message, AnalyticsEvent.class);
            log.info("Received analytics event: type={}, entityId={}, userId={}, partition={}, offset={}",
                    event.getEventType(), event.getEntityId(), event.getUserId(), partition, offset);

            aggregateEvent(event);

            ack.acknowledge();
        } catch (Exception e) {
            log.error("Error processing analytics event: key={}, message={}", key, message, e);
            ack.acknowledge();
        }
    }

    private void aggregateEvent(AnalyticsEvent event) {
        eventTypeCounts.computeIfAbsent(event.getEventType(), k -> new AtomicInteger(0)).incrementAndGet();

        switch (event.getEventType()) {
            case ORDER_PLACED -> {
                orderCount.incrementAndGet();
                ordersByStatus.computeIfAbsent("PLACED", k -> new AtomicInteger(0)).incrementAndGet();
                if (event.getRevenue() != null) {
                    totalRevenue.updateAndGet(v -> v + event.getRevenue());
                }
            }
            case ORDER_DELIVERED -> {
                ordersByStatus.computeIfAbsent("DELIVERED", k -> new AtomicInteger(0)).incrementAndGet();
            }
            case ORDER_CANCELLED -> {
                cancelledOrderCount.incrementAndGet();
                ordersByStatus.computeIfAbsent("CANCELLED", k -> new AtomicInteger(0)).incrementAndGet();
            }
            case PAYMENT_COMPLETED -> {
                if (event.getRevenue() != null) {
                    totalRevenue.updateAndGet(v -> v + event.getRevenue());
                }
            }
            default -> log.trace("Tracking event type: {}", event.getEventType());
        }

        log.debug("Analytics snapshot - orders: {}, cancelled: {}, revenue: {}, eventTypes: {}",
                orderCount.get(), cancelledOrderCount.get(), totalRevenue.get(), eventTypeCounts);
    }

    public Map<String, Object> getDashboardMetrics() {
        return Map.of(
                "totalOrders", orderCount.get(),
                "cancelledOrders", cancelledOrderCount.get(),
                "totalRevenue", totalRevenue.get(),
                "ordersByStatus", ordersByStatus.entrySet().stream()
                        .collect(java.util.stream.Collectors.toMap(Map.Entry::getKey, e -> e.getValue().get())),
                "eventsByType", eventTypeCounts.entrySet().stream()
                        .collect(java.util.stream.Collectors.toMap(e -> e.getKey().name(), e -> e.getValue().get()))
        );
    }
}
