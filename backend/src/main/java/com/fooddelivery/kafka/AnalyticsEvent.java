package com.fooddelivery.kafka;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AnalyticsEvent {

    public enum EventType {
        ORDER_PLACED, ORDER_CANCELLED, ORDER_DELIVERED,
        PAYMENT_COMPLETED, PAYMENT_FAILED, USER_REGISTERED,
        USER_LOGIN, VENDOR_ADDED, ITEM_VIEWED, SEARCH_PERFORMED
    }

    private EventType eventType;
    private UUID entityId;
    private UUID userId;
    private UUID vendorId;
    private Double revenue;
    private String category;
    private String searchQuery;
    private String metadata;
    private Instant timestamp;
}
