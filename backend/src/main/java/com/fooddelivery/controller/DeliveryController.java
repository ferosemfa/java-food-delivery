package com.fooddelivery.controller;

import com.fooddelivery.dto.*;
import com.fooddelivery.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @PostMapping("/assign")
    public ResponseEntity<ApiResponse<DeliveryResponse>> assignDriver(@Valid @RequestBody DeliveryRequest request) {
        DeliveryResponse response = deliveryService.assignDriver(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Driver assigned successfully", response));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<DeliveryResponse>> getDeliveryByOrder(@PathVariable UUID orderId) {
        DeliveryResponse response = deliveryService.getDeliveryByOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<DeliveryResponse>>> getDriverDeliveries(@PathVariable UUID driverId) {
        List<DeliveryResponse> deliveries = deliveryService.getDriverDeliveries(driverId);
        return ResponseEntity.ok(ApiResponse.success(deliveries));
    }

    @PatchMapping("/{deliveryId}/status")
    public ResponseEntity<ApiResponse<DeliveryResponse>> updateDeliveryStatus(
            @PathVariable UUID deliveryId,
            @RequestParam String status,
            @RequestParam(required = false) String currentLocation,
            @RequestParam(required = false) String estimatedTime) {
        DeliveryResponse response = deliveryService.updateDeliveryStatus(deliveryId, status, currentLocation, estimatedTime);
        return ResponseEntity.ok(ApiResponse.success("Delivery status updated", response));
    }

    @PatchMapping("/{deliveryId}/location")
    public ResponseEntity<ApiResponse<Void>> updateDriverLocation(
            @PathVariable UUID deliveryId,
            @RequestParam String location) {
        deliveryService.updateDriverLocation(deliveryId, location);
        return ResponseEntity.ok(ApiResponse.success("Location updated", null));
    }
}