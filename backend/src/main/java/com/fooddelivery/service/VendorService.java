package com.fooddelivery.service;

import com.fooddelivery.dto.MenuRequest;
import com.fooddelivery.dto.MenuResponse;
import com.fooddelivery.dto.VendorRequest;
import com.fooddelivery.model.Menu;
import com.fooddelivery.model.User;
import com.fooddelivery.model.Vendor;
import com.fooddelivery.repository.MenuRepository;
import com.fooddelivery.repository.UserRepository;
import com.fooddelivery.repository.VendorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class VendorService {

    private static final Logger log = LoggerFactory.getLogger(VendorService.class);

    private final VendorRepository vendorRepository;
    private final MenuRepository menuRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, Object> redisTemplate;

    public VendorService(VendorRepository vendorRepository,
                         MenuRepository menuRepository,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder,
                         RedisTemplate<String, Object> redisTemplate) {
        this.vendorRepository = vendorRepository;
        this.menuRepository = menuRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.redisTemplate = redisTemplate;
    }

    public Vendor registerVendor(VendorRequest request) {
        if (vendorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Vendor email already registered");
        }

        UUID vendorId = UUID.randomUUID();

        Vendor vendor = Vendor.builder()
                .vendorId(vendorId)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .address(request.getAddress())
                .rating(0.0)
                .isApproved(false)
                .createdAt(Instant.now())
                .build();

        vendorRepository.save(vendor);

        User user = User.builder()
                .userId(UUID.randomUUID())
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("VENDOR")
                .createdAt(Instant.now())
                .build();

        userRepository.save(user);

        return vendor;
    }

    @Cacheable(value = "vendors", key = "#vendorId")
    public Vendor getVendor(UUID vendorId) {
        return vendorRepository.findById(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    public List<Vendor> getAllVendors() {
        return (List<Vendor>) vendorRepository.findAll();
    }

    @CacheEvict(value = "vendors", key = "#vendorId")
    public Vendor updateVendor(UUID vendorId, VendorRequest request) {
        Vendor vendor = getVendor(vendorId);
        vendor.setName(request.getName());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setAddress(request.getAddress());
        return vendorRepository.save(vendor);
    }

    @CacheEvict(value = "vendors", key = "#vendorId")
    public void deleteVendor(UUID vendorId) {
        vendorRepository.deleteById(vendorId);
    }

    public List<Vendor> getApprovedVendors() {
        return vendorRepository.findByIsApproved(true);
    }

    public List<Vendor> getPendingVendors() {
        return vendorRepository.findByIsApproved(false);
    }

    @CacheEvict(value = "vendors", key = "#vendorId")
    public Vendor approveVendor(UUID vendorId) {
        Vendor vendor = getVendor(vendorId);
        vendor.setIsApproved(true);
        return vendorRepository.save(vendor);
    }

    public List<Vendor> searchVendors(String name) {
        return vendorRepository.findByNameContaining(name);
    }

    public Menu addMenuItem(MenuRequest request) {
        Vendor vendor = getVendor(request.getVendorId());

        Menu menu = Menu.builder()
                .menuId(UUID.randomUUID())
                .vendorId(request.getVendorId())
                .itemName(request.getItemName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();

        menuRepository.save(menu);

        String cacheKey = "vendor_menu:" + request.getVendorId();
        redisTemplate.delete(cacheKey);

        return menu;
    }

    public Menu updateMenuItem(UUID menuId, MenuRequest request) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        menu.setItemName(request.getItemName());
        menu.setDescription(request.getDescription());
        menu.setPrice(request.getPrice());
        menu.setCategory(request.getCategory());
        menu.setImageUrl(request.getImageUrl());
        menu.setIsAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : menu.getIsAvailable());

        menuRepository.save(menu);

        String cacheKey = "vendor_menu:" + menu.getVendorId();
        redisTemplate.delete(cacheKey);

        return menu;
    }

    public void deleteMenuItem(UUID menuId) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuRepository.deleteById(menuId);

        String cacheKey = "vendor_menu:" + menu.getVendorId();
        redisTemplate.delete(cacheKey);
    }

    public Menu getMenuItem(UUID menuId) {
        return menuRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
    }

    public List<Menu> getVendorMenu(UUID vendorId) {
        String cacheKey = "vendor_menu:" + vendorId;
        List<Menu> cachedMenu = (List<Menu>) redisTemplate.opsForValue().get(cacheKey);
        if (cachedMenu != null) {
            return cachedMenu;
        }

        List<Menu> menu = menuRepository.findByVendorIdAndIsAvailable(vendorId, true);

        redisTemplate.opsForValue().set(cacheKey, menu, 30, TimeUnit.MINUTES);

        return menu;
    }

    public List<Menu> getVendorMenuByCategory(UUID vendorId, String category) {
        return menuRepository.findByVendorIdAndCategory(vendorId, category);
    }

    public List<MenuResponse> getMenuResponses(List<Menu> menuItems) {
        return menuItems.stream()
                .map(this::toMenuResponse)
                .collect(Collectors.toList());
    }

    public MenuResponse toMenuResponse(Menu menu) {
        Vendor vendor = vendorRepository.findById(menu.getVendorId()).orElse(null);
        return MenuResponse.builder()
                .menuId(menu.getMenuId())
                .vendorId(menu.getVendorId())
                .vendorName(vendor != null ? vendor.getName() : null)
                .itemName(menu.getItemName())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .category(menu.getCategory())
                .imageUrl(menu.getImageUrl())
                .isAvailable(menu.getIsAvailable())
                .build();
    }
}