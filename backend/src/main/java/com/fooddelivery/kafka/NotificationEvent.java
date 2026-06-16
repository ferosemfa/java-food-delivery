package com.fooddelivery.kafka;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationEvent {

    public enum Channel {
        SMS, EMAIL, PUSH
    }

    public enum Type {
        ORDER_CONFIRMATION, STATUS_UPDATE, PAYMENT_RECEIVED,
        PAYMENT_FAILED, DELIVERY_ALERT, PROMOTION
    }

    private UUID notificationId;
    private UUID userId;
    private String userEmail;
    private String userPhone;
    private String deviceToken;
    private Channel channel;
    private Type type;
    private String subject;
    private String body;
    private Map<String, String> templateParams;
    private UUID referenceId;
    private String referenceType;
    private Instant createdAt;
}
