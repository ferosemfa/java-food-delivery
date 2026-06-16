package com.fooddelivery.service;

import com.fooddelivery.dto.PaymentRequest;
import com.fooddelivery.dto.PaymentResponse;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.Payment;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${stripe.api-key:}")
    private String stripeApiKey;

    @Value("${razorpay.api-key:}")
    private String razorpayApiKey;

    @Value("${razorpay.api-secret:}")
    private String razorpayApiSecret;

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          KafkaTemplate<String, Object> kafkaTemplate) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public PaymentResponse processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (paymentRepository.findByOrderId(request.getOrderId()).isPresent()) {
            throw new RuntimeException("Payment already exists for this order");
        }

        UUID paymentId = UUID.randomUUID();
        String transactionId = UUID.randomUUID().toString();
        String status = "COMPLETED";

        Payment payment = Payment.builder()
                .paymentId(paymentId)
                .orderId(request.getOrderId())
                .method(request.getMethod())
                .status(status)
                .transactionId(transactionId)
                .amount(request.getAmount())
                .timestamp(Instant.now())
                .build();

        paymentRepository.save(payment);

        order.setStatus("PAID");
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);

        kafkaTemplate.send("payment-events", order.getOrderId().toString(),
                Map.of(
                        "type", "PAYMENT_COMPLETED",
                        "paymentId", paymentId.toString(),
                        "orderId", order.getOrderId().toString(),
                        "amount", request.getAmount(),
                        "method", request.getMethod(),
                        "transactionId", transactionId,
                        "timestamp", Instant.now().toString()
                ));

        return PaymentResponse.builder()
                .paymentId(paymentId)
                .orderId(request.getOrderId())
                .method(request.getMethod())
                .status(status)
                .transactionId(transactionId)
                .amount(request.getAmount())
                .timestamp(Instant.now())
                .build();
    }

    public PaymentResponse getPaymentByOrder(UUID orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order"));

        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderId(payment.getOrderId())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .timestamp(payment.getTimestamp())
                .build();
    }

    public PaymentResponse getPaymentById(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderId(payment.getOrderId())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .timestamp(payment.getTimestamp())
                .build();
    }

    public String handleStripeWebhook(String payload, String signature) {
        log.info("Stripe webhook received: payload length={}", payload.length());
        kafkaTemplate.send("payment-events", "stripe-webhook",
                Map.of("type", "STRIPE_WEBHOOK", "payload", payload, "signature", signature));
        return "Webhook received";
    }

    public String handleRazorpayWebhook(String payload, String signature) {
        log.info("Razorpay webhook received: payload length={}", payload.length());
        kafkaTemplate.send("payment-events", "razorpay-webhook",
                Map.of("type", "RAZORPAY_WEBHOOK", "payload", payload, "signature", signature));
        return "Webhook received";
    }

    public PaymentResponse refundPayment(UUID paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus("REFUNDED");
        paymentRepository.save(payment);

        Order order = orderRepository.findById(payment.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus("REFUNDED");
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);

        kafkaTemplate.send("payment-events", payment.getOrderId().toString(),
                Map.of(
                        "type", "PAYMENT_REFUNDED",
                        "paymentId", paymentId.toString(),
                        "orderId", payment.getOrderId().toString(),
                        "amount", payment.getAmount(),
                        "timestamp", Instant.now().toString()
                ));

        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderId(payment.getOrderId())
                .method(payment.getMethod())
                .status(payment.getStatus())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .timestamp(payment.getTimestamp())
                .build();
    }
}