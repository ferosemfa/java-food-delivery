package com.fooddelivery.service;

import com.fooddelivery.dto.DeliveryRequest;
import com.fooddelivery.dto.DeliveryResponse;
import com.fooddelivery.model.Delivery;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.User;
import com.fooddelivery.repository.DeliveryRepository;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    private static final Logger log = LoggerFactory.getLogger(DeliveryService.class);

    private final DeliveryRepository deliveryRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           OrderRepository orderRepository,
                           UserRepository userRepository,
                           KafkaTemplate<String, Object> kafkaTemplate) {
        this.deliveryRepository = deliveryRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public DeliveryResponse assignDriver(DeliveryRequest request) {
        if (deliveryRepository.findByOrderId(request.getOrderId()).isPresent()) {
            throw new RuntimeException("Delivery already assigned for this order");
        }

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User driver = userRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        if (!"DRIVER".equals(driver.getRole())) {
            throw new RuntimeException("User is not a driver");
        }

        Delivery delivery = Delivery.builder()
                .deliveryId(UUID.randomUUID())
                .orderId(request.getOrderId())
                .driverId(request.getDriverId())
                .status("ASSIGNED")
                .currentLocation(request.getCurrentLocation())
                .estimatedTime(request.getEstimatedTime())
                .build();

        deliveryRepository.save(delivery);

        order.setStatus("OUT_FOR_DELIVERY");
        order.setUpdatedAt(java.time.Instant.now());
        orderRepository.save(order);

        kafkaTemplate.send("delivery-events", request.getOrderId().toString(),
                Map.of(
                        "type", "DRIVER_ASSIGNED",
                        "deliveryId", delivery.getDeliveryId().toString(),
                        "orderId", request.getOrderId().toString(),
                        "driverId", request.getDriverId().toString(),
                        "driverName", driver.getName(),
                        "timestamp", java.time.Instant.now().toString()
                ));

        return DeliveryResponse.builder()
                .deliveryId(delivery.getDeliveryId())
                .orderId(delivery.getOrderId())
                .driverId(delivery.getDriverId())
                .driverName(driver.getName())
                .driverPhone(driver.getPhone())
                .status(delivery.getStatus())
                .currentLocation(delivery.getCurrentLocation())
                .estimatedTime(delivery.getEstimatedTime())
                .build();
    }

    public DeliveryResponse updateDeliveryStatus(UUID deliveryId, String status, String currentLocation, String estimatedTime) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));

        delivery.setStatus(status);
        if (currentLocation != null) {
            delivery.setCurrentLocation(currentLocation);
        }
        if (estimatedTime != null) {
            delivery.setEstimatedTime(estimatedTime);
        }
        deliveryRepository.save(delivery);

        Order order = orderRepository.findById(delivery.getOrderId())
                .orElse(null);
        if (order != null) {
            order.setStatus(status.equals("DELIVERED") ? "DELIVERED" : order.getStatus());
            order.setUpdatedAt(java.time.Instant.now());
            orderRepository.save(order);
        }

        User driver = userRepository.findById(delivery.getDriverId()).orElse(null);

        kafkaTemplate.send("delivery-events", delivery.getOrderId().toString(),
                Map.of(
                        "type", "DELIVERY_STATUS_UPDATED",
                        "deliveryId", deliveryId.toString(),
                        "orderId", delivery.getOrderId().toString(),
                        "status", status,
                        "location", currentLocation,
                        "timestamp", java.time.Instant.now().toString()
                ));

        return DeliveryResponse.builder()
                .deliveryId(delivery.getDeliveryId())
                .orderId(delivery.getOrderId())
                .driverId(delivery.getDriverId())
                .driverName(driver != null ? driver.getName() : null)
                .driverPhone(driver != null ? driver.getPhone() : null)
                .status(delivery.getStatus())
                .currentLocation(delivery.getCurrentLocation())
                .estimatedTime(delivery.getEstimatedTime())
                .build();
    }

    public DeliveryResponse getDeliveryByOrder(UUID orderId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Delivery not found for order"));

        User driver = userRepository.findById(delivery.getDriverId()).orElse(null);

        return DeliveryResponse.builder()
                .deliveryId(delivery.getDeliveryId())
                .orderId(delivery.getOrderId())
                .driverId(delivery.getDriverId())
                .driverName(driver != null ? driver.getName() : null)
                .driverPhone(driver != null ? driver.getPhone() : null)
                .status(delivery.getStatus())
                .currentLocation(delivery.getCurrentLocation())
                .estimatedTime(delivery.getEstimatedTime())
                .build();
    }

    public List<DeliveryResponse> getDriverDeliveries(UUID driverId) {
        List<Delivery> deliveries = deliveryRepository.findByDriverId(driverId);
        return deliveries.stream()
                .map(delivery -> {
                    User driver = userRepository.findById(delivery.getDriverId()).orElse(null);
                    return DeliveryResponse.builder()
                            .deliveryId(delivery.getDeliveryId())
                            .orderId(delivery.getOrderId())
                            .driverId(delivery.getDriverId())
                            .driverName(driver != null ? driver.getName() : null)
                            .driverPhone(driver != null ? driver.getPhone() : null)
                            .status(delivery.getStatus())
                            .currentLocation(delivery.getCurrentLocation())
                            .estimatedTime(delivery.getEstimatedTime())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public void updateDriverLocation(UUID deliveryId, String location) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new RuntimeException("Delivery not found"));
        delivery.setCurrentLocation(location);
        deliveryRepository.save(delivery);

        kafkaTemplate.send("delivery-events", delivery.getOrderId().toString(),
                Map.of(
                        "type", "LOCATION_UPDATED",
                        "deliveryId", deliveryId.toString(),
                        "orderId", delivery.getOrderId().toString(),
                        "location", location,
                        "timestamp", java.time.Instant.now().toString()
                ));
    }
}