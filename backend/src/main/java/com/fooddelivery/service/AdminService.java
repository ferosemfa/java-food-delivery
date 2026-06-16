package com.fooddelivery.service;

import com.fooddelivery.dto.AnalyticsResponse;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.User;
import com.fooddelivery.model.Vendor;
import com.fooddelivery.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;
    private final ReviewRepository reviewRepository;

    public AdminService(UserRepository userRepository,
                        VendorRepository vendorRepository,
                        OrderRepository orderRepository,
                        MenuRepository menuRepository,
                        ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
        this.orderRepository = orderRepository;
        this.menuRepository = menuRepository;
        this.reviewRepository = reviewRepository;
    }

    public List<User> getAllUsers() {
        return (List<User>) userRepository.findAll();
    }

    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(UUID userId) {
        userRepository.deleteById(userId);
    }

    public User updateUserRole(UUID userId, String role) {
        User user = getUserById(userId);
        user.setRole(role.toUpperCase());
        return userRepository.save(user);
    }

    public List<Vendor> getAllVendors() {
        return (List<Vendor>) vendorRepository.findAll();
    }

    public Vendor approveVendor(UUID vendorId) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
        vendor.setIsApproved(true);
        return vendorRepository.save(vendor);
    }

    public void deleteVendor(UUID vendorId) {
        vendorRepository.deleteById(vendorId);
    }

    public List<Order> getAllOrders() {
        return (List<Order>) orderRepository.findAll();
    }

    public AnalyticsResponse getAnalytics() {
        List<User> users = (List<User>) userRepository.findAll();
        List<Vendor> vendors = (List<Vendor>) vendorRepository.findAll();
        List<Order> orders = (List<Order>) orderRepository.findAll();

        long totalUsers = users.size();
        long totalVendors = vendors.size();
        long totalOrders = orders.size();
        long totalRevenue = (long) orders.stream()
                .filter(o -> "DELIVERED".equals(o.getStatus()))
                .mapToDouble(Order::getTotalAmount)
                .sum();

        Map<String, Long> ordersByStatus = orders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));

        Map<String, Double> revenueByPeriod = new HashMap<>();
        revenueByPeriod.put("total", (double) totalRevenue);

        Map<String, Long> topVendors = orders.stream()
                .filter(o -> o.getVendorId() != null)
                .collect(Collectors.groupingBy(
                        o -> {
                            Vendor v = vendorRepository.findById(o.getVendorId()).orElse(null);
                            return v != null ? v.getName() : "Unknown";
                        },
                        Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));

        Map<String, Long> popularItems = new HashMap<>();
        orders.stream()
                .filter(o -> o.getItems() != null)
                .flatMap(o -> o.getItems().stream())
                .forEach(itemRef -> {
                    try {
                        UUID itemId = UUID.fromString(itemRef);
                        com.fooddelivery.model.Menu menuItem = menuRepository.findById(itemId).orElse(null);
                        if (menuItem != null) {
                            popularItems.merge(menuItem.getItemName(), 1L, Long::sum);
                        }
                    } catch (Exception e) {
                    }
                });

        Map<String, Long> topItems = popularItems.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));

        return AnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalVendors(totalVendors)
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .ordersByStatus(ordersByStatus)
                .revenueByPeriod(revenueByPeriod)
                .topVendors(topVendors)
                .popularItems(topItems)
                .build();
    }
}