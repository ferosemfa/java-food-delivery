package com.fooddelivery.controller;

import com.fooddelivery.dto.*;
import com.fooddelivery.model.Review;
import com.fooddelivery.repository.ReviewRepository;
import com.fooddelivery.repository.UserRepository;
import com.fooddelivery.repository.VendorRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;

    public ReviewController(ReviewRepository reviewRepository,
                            UserRepository userRepository,
                            VendorRepository vendorRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.vendorRepository = vendorRepository;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        com.fooddelivery.model.User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = Review.builder()
                .reviewId(UUID.randomUUID())
                .userId(user.getUserId())
                .vendorId(request.getVendorId())
                .orderId(request.getOrderId())
                .rating(request.getRating())
                .comment(request.getComment())
                .timestamp(Instant.now())
                .build();

        reviewRepository.save(review);

        ReviewResponse response = buildReviewResponse(review);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review created successfully", response));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getVendorReviews(@PathVariable UUID vendorId) {
        List<Review> reviews = reviewRepository.findByVendorId(vendorId);
        List<ReviewResponse> responses = reviews.stream()
                .map(this::buildReviewResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getUserReviews(@PathVariable UUID userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
        List<ReviewResponse> responses = reviews.stream()
                .map(this::buildReviewResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    private ReviewResponse buildReviewResponse(Review review) {
        com.fooddelivery.model.User user = userRepository.findById(review.getUserId()).orElse(null);
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUserId())
                .userName(user != null ? user.getName() : "Unknown")
                .vendorId(review.getVendorId())
                .orderId(review.getOrderId())
                .rating(review.getRating())
                .comment(review.getComment())
                .timestamp(review.getTimestamp())
                .build();
    }
}