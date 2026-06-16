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
public class MenuResponse {

    private UUID menuId;
    private UUID vendorId;
    private String vendorName;
    private String itemName;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private Boolean isAvailable;
}