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
public class ReviewResponse {

    private UUID reviewId;
    private UUID userId;
    private String userName;
    private UUID vendorId;
    private UUID orderId;
    private Integer rating;
    private String comment;
    private Instant timestamp;
}