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
public class PaymentEvent {

    public enum PaymentStatus {
        SUCCESS, FAILED, REFUNDED, PENDING
    }

    private UUID paymentId;
    private UUID orderId;
    private UUID userId;
    private PaymentStatus status;
    private Double amount;
    private String method;
    private String transactionId;
    private String gateway;
    private String failureReason;
    private Instant timestamp;
}
