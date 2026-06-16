package com.fooddelivery.controller;

import com.fooddelivery.dto.ApiResponse;
import com.fooddelivery.dto.MenuResponse;
import com.fooddelivery.model.Menu;
import com.fooddelivery.service.VendorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final VendorService vendorService;

    public MenuController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<MenuResponse>>> getVendorMenu(@PathVariable UUID vendorId) {
        List<Menu> menuItems = vendorService.getVendorMenu(vendorId);
        List<MenuResponse> responses = vendorService.getMenuResponses(menuItems);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/vendor/{vendorId}/category/{category}")
    public ResponseEntity<ApiResponse<List<Menu>>> getMenuByCategory(
            @PathVariable UUID vendorId,
            @PathVariable String category) {
        List<Menu> menuItems = vendorService.getVendorMenuByCategory(vendorId, category);
        return ResponseEntity.ok(ApiResponse.success(menuItems));
    }

    @GetMapping("/{menuId}")
    public ResponseEntity<ApiResponse<Menu>> getMenuItem(@PathVariable UUID menuId) {
        Menu menu = vendorService.getMenuItem(menuId);
        return ResponseEntity.ok(ApiResponse.success(menu));
    }
}