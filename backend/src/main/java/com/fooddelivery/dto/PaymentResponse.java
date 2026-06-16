package com.fooddelivery.dto;

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
public class PaymentResponse {

    private UUID paymentId;
    private UUID orderId;
    private String method;
    private String status;
    private String transactionId;
    private Double amount;
    private Instant timestamp;
    private String paymentUrl;
}