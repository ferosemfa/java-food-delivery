package com.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private UUID orderId;
    private UUID customerId;
    private UUID vendorId;
    private List<OrderItemResponse> items;
    private Double totalAmount;
    private String status;
    private String deliveryAddress;
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private UUID itemId;
        private UUID foodItemId;
        private String foodItemName;
        private Integer quantity;
        private Double price;
    }
}