package com.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryResponse {

    private UUID deliveryId;
    private UUID orderId;
    private UUID driverId;
    private String driverName;
    private String driverPhone;
    private String status;
    private String currentLocation;
    private String estimatedTime;
}