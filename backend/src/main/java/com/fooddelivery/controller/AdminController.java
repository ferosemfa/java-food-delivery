package com.fooddelivery.controller;

import com.fooddelivery.dto.*;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.User;
import com.fooddelivery.model.Vendor;
import com.fooddelivery.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<User>> getUser(@PathVariable UUID userId) {
        User user = adminService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(@PathVariable UUID userId, @RequestParam String role) {
        User user = adminService.updateUserRole(userId, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated", user));
    }

    @GetMapping("/vendors")
    public ResponseEntity<ApiResponse<List<Vendor>>> getAllVendors() {
        List<Vendor> vendors = adminService.getAllVendors();
        return ResponseEntity.ok(ApiResponse.success(vendors));
    }

    @PatchMapping("/vendors/{vendorId}/approve")
    public ResponseEntity<ApiResponse<Vendor>> approveVendor(@PathVariable UUID vendorId) {
        Vendor vendor = adminService.approveVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Vendor approved successfully", vendor));
    }

    @DeleteMapping("/vendors/{vendorId}")
    public ResponseEntity<ApiResponse<Void>> deleteVendor(@PathVariable UUID vendorId) {
        adminService.deleteVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Vendor deleted successfully", null));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = adminService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics() {
        AnalyticsResponse analytics = adminService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }
}