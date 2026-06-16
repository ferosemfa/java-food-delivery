package com.fooddelivery.dto;

import jakarta.validation.constraints.NotBlank;
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
public class MenuRequest {

    @NotNull(message = "Vendor ID is required")
    private UUID vendorId;

    @NotBlank(message = "Item name is required")
    private String itemName;

    private String description;

    @NotNull(message = "Price is required")
    private Double price;

    private String category;

    private String imageUrl;

    private Boolean isAvailable;
}