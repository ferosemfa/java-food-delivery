package com.fooddelivery.controller;

import com.fooddelivery.dto.*;
import com.fooddelivery.model.Menu;
import com.fooddelivery.model.Vendor;
import com.fooddelivery.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Vendor>> registerVendor(@Valid @RequestBody VendorRequest request) {
        Vendor vendor = vendorService.registerVendor(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Vendor registered successfully", vendor));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Vendor>>> getAllVendors() {
        List<Vendor> vendors = vendorService.getAllVendors();
        return ResponseEntity.ok(ApiResponse.success(vendors));
    }

    @GetMapping("/approved")
    public ResponseEntity<ApiResponse<List<Vendor>>> getApprovedVendors() {
        List<Vendor> vendors = vendorService.getApprovedVendors();
        return ResponseEntity.ok(ApiResponse.success(vendors));
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<ApiResponse<Vendor>> getVendor(@PathVariable UUID vendorId) {
        Vendor vendor = vendorService.getVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success(vendor));
    }

    @PutMapping("/{vendorId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Vendor>> updateVendor(@PathVariable UUID vendorId,
                                                             @Valid @RequestBody VendorRequest request) {
        Vendor vendor = vendorService.updateVendor(vendorId, request);
        return ResponseEntity.ok(ApiResponse.success("Vendor updated successfully", vendor));
    }

    @DeleteMapping("/{vendorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteVendor(@PathVariable UUID vendorId) {
        vendorService.deleteVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success("Vendor deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Vendor>>> searchVendors(@RequestParam String name) {
        List<Vendor> vendors = vendorService.searchVendors(name);
        return ResponseEntity.ok(ApiResponse.success(vendors));
    }

    @GetMapping("/{vendorId}/menu")
    public ResponseEntity<ApiResponse<List<MenuResponse>>> getVendorMenu(@PathVariable UUID vendorId) {
        List<Menu> menuItems = vendorService.getVendorMenu(vendorId);
        List<MenuResponse> responses = vendorService.getMenuResponses(menuItems);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping("/menu")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Menu>> addMenuItem(@Valid @RequestBody MenuRequest request) {
        Menu menu = vendorService.addMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu item added successfully", menu));
    }

    @PutMapping("/menu/{menuId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Menu>> updateMenuItem(@PathVariable UUID menuId,
                                                             @Valid @RequestBody MenuRequest request) {
        Menu menu = vendorService.updateMenuItem(menuId, request);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated successfully", menu));
    }

    @DeleteMapping("/menu/{menuId}")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable UUID menuId) {
        vendorService.deleteMenuItem(menuId);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted successfully", null));
    }

    @GetMapping("/menu/{menuId}")
    public ResponseEntity<ApiResponse<Menu>> getMenuItem(@PathVariable UUID menuId) {
        Menu menu = vendorService.getMenuItem(menuId);
        return ResponseEntity.ok(ApiResponse.success(menu));
    }

    @GetMapping("/{vendorId}/menu/category/{category}")
    public ResponseEntity<ApiResponse<List<Menu>>> getMenuByCategory(@PathVariable UUID vendorId,
                                                                       @PathVariable String category) {
        List<Menu> menuItems = vendorService.getVendorMenuByCategory(vendorId, category);
        return ResponseEntity.ok(ApiResponse.success(menuItems));
    }
}