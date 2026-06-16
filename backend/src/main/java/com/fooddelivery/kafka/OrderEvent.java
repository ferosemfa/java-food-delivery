package com.fooddelivery.kafka;

import com.fasterxml.jackson.annotation.JsonFormat;
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
public class OrderEvent {

    private String eventType;
    private UUID orderId;
    private UUID customerId;
    private UUID vendorId;
    private Double totalAmount;
    private String status;
    private String deliveryAddress;
    private String customerEmail;
    private String customerPhone;
    private String vendorName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant timestamp;
}
