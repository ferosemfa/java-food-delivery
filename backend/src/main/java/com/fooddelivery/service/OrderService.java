package com.fooddelivery.service;

import com.fooddelivery.dto.OrderRequest;
import com.fooddelivery.dto.OrderResponse;
import com.fooddelivery.model.*;
import com.fooddelivery.repository.*;
import com.fooddelivery.security.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final MenuRepository menuRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        MenuRepository menuRepository,
                        VendorRepository vendorRepository,
                        UserRepository userRepository,
                        KafkaTemplate<String, Object> kafkaTemplate) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.menuRepository = menuRepository;
        this.vendorRepository = vendorRepository;
        this.userRepository = userRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public OrderResponse createOrder(String userEmail, OrderRequest request) {
        User customer = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        double totalAmount = 0.0;
        List<String> itemRefs = new ArrayList<>();

        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Menu menuItem = menuRepository.findById(itemReq.getFoodItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + itemReq.getFoodItemId()));

            if (!menuItem.getIsAvailable()) {
                throw new RuntimeException("Menu item not available: " + menuItem.getItemName());
            }

            double itemTotal = menuItem.getPrice() * itemReq.getQuantity();
            totalAmount += itemTotal;

            OrderItem orderItem = OrderItem.builder()
                    .itemId(UUID.randomUUID())
                    .foodItemId(itemReq.getFoodItemId())
                    .quantity(itemReq.getQuantity())
                    .price(menuItem.getPrice())
                    .build();

            orderItemRepository.save(orderItem);
            itemRefs.add(orderItem.getItemId().toString());
        }

        UUID orderId = UUID.randomUUID();
        Instant now = Instant.now();

        Order order = Order.builder()
                .orderId(orderId)
                .customerId(customer.getUserId())
                .vendorId(request.getVendorId())
                .items(itemRefs)
                .totalAmount(totalAmount)
                .status("PENDING")
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryLatitude(request.getDeliveryLatitude())
                .deliveryLongitude(request.getDeliveryLongitude())
                .createdAt(now)
                .updatedAt(now)
                .build();

        orderRepository.save(order);

        kafkaTemplate.send("order-events", orderId.toString(),
                buildOrderEvent("ORDER_CREATED", order, customer, vendor));

        return buildOrderResponse(order, customer, vendor);
    }

    public OrderResponse getOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        User customer = userRepository.findById(order.getCustomerId())
                .orElse(null);
        Vendor vendor = vendorRepository.findById(order.getVendorId())
                .orElse(null);
        return buildOrderResponse(order, customer, vendor);
    }

    public List<OrderResponse> getCustomerOrders(UUID customerId) {
        List<Order> orders = orderRepository.findByCustomerId(customerId);
        return orders.stream()
                .map(order -> {
                    User customer = userRepository.findById(order.getCustomerId()).orElse(null);
                    Vendor vendor = vendorRepository.findById(order.getVendorId()).orElse(null);
                    return buildOrderResponse(order, customer, vendor);
                })
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getVendorOrders(UUID vendorId) {
        List<Order> orders = orderRepository.findByVendorId(vendorId);
        return orders.stream()
                .map(order -> {
                    User customer = userRepository.findById(order.getCustomerId()).orElse(null);
                    Vendor vendor = vendorRepository.findById(order.getVendorId()).orElse(null);
                    return buildOrderResponse(order, customer, vendor);
                })
                .collect(Collectors.toList());
    }

    public OrderResponse updateOrderStatus(UUID orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);

        kafkaTemplate.send("order-events", orderId.toString(),
                buildStatusEvent("ORDER_STATUS_CHANGED", order, status));

        User customer = userRepository.findById(order.getCustomerId()).orElse(null);
        Vendor vendor = vendorRepository.findById(order.getVendorId()).orElse(null);
        return buildOrderResponse(order, customer, vendor);
    }

    public void cancelOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getStatus().equals("PENDING")) {
            throw new RuntimeException("Cannot cancel order in status: " + order.getStatus());
        }

        order.setStatus("CANCELLED");
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);

        kafkaTemplate.send("order-events", orderId.toString(),
                buildStatusEvent("ORDER_CANCELLED", order, "CANCELLED"));
    }

    private OrderResponse buildOrderResponse(Order order, User customer, Vendor vendor) {
        List<OrderResponse.OrderItemResponse> itemResponses = new ArrayList<>();
        if (order.getItems() != null) {
            for (String itemRef : order.getItems()) {
                UUID itemId = UUID.fromString(itemRef);
                OrderItem orderItem = orderItemRepository.findById(itemId).orElse(null);
                if (orderItem != null) {
                    Menu menuItem = menuRepository.findById(orderItem.getFoodItemId()).orElse(null);
                    itemResponses.add(OrderResponse.OrderItemResponse.builder()
                            .itemId(orderItem.getItemId())
                            .foodItemId(orderItem.getFoodItemId())
                            .foodItemName(menuItem != null ? menuItem.getItemName() : "Unknown")
                            .quantity(orderItem.getQuantity())
                            .price(orderItem.getPrice())
                            .build());
                }
            }
        }

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .customerId(order.getCustomerId())
                .vendorId(order.getVendorId())
                .items(itemResponses)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryLatitude(order.getDeliveryLatitude())
                .deliveryLongitude(order.getDeliveryLongitude())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private Object buildOrderEvent(String type, Order order, User customer, Vendor vendor) {
        return java.util.Map.of(
                "type", type,
                "orderId", order.getOrderId().toString(),
                "customerEmail", customer != null ? customer.getEmail() : null,
                "vendorName", vendor != null ? vendor.getName() : null,
                "totalAmount", order.getTotalAmount(),
                "status", order.getStatus(),
                "timestamp", Instant.now().toString()
        );
    }

    private Object buildStatusEvent(String type, Order order, String status) {
        return java.util.Map.of(
                "type", type,
                "orderId", order.getOrderId().toString(),
                "status", status,
                "timestamp", Instant.now().toString()
        );
    }
}