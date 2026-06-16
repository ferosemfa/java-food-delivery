package com.fooddelivery.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequest {

    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotNull(message = "Driver ID is required")
    private UUID driverId;

    private String currentLocation;
    private String estimatedTime;
}