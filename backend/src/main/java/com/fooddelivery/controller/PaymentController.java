package com.fooddelivery.controller;

import com.fooddelivery.dto.*;
import com.fooddelivery.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", response));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrder(@PathVariable UUID orderId) {
        PaymentResponse response = paymentService.getPaymentByOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable UUID paymentId) {
        PaymentResponse response = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<PaymentResponse>> refundPayment(@PathVariable UUID paymentId) {
        PaymentResponse response = paymentService.refundPayment(paymentId);
        return ResponseEntity.ok(ApiResponse.success("Payment refunded successfully", response));
    }

    @PostMapping("/webhook/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        String result = paymentService.handleStripeWebhook(payload, signature);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/webhook/razorpay")
    public ResponseEntity<String> handleRazorpayWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String signature) {
        String result = paymentService.handleRazorpayWebhook(payload, signature);
        return ResponseEntity.ok(result);
    }
}