package com.fooddelivery.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fooddelivery.model.Order;
import com.fooddelivery.model.Payment;
import com.fooddelivery.repository.OrderRepository;
import com.fooddelivery.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventConsumer.class);

    private final ObjectMapper objectMapper;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public PaymentEventConsumer(ObjectMapper objectMapper,
                                OrderRepository orderRepository,
                                PaymentRepository paymentRepository) {
        this.objectMapper = objectMapper;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @KafkaListener(topics = "payment-events", groupId = "${spring.kafka.consumer.group-id}", concurrency = "3")
    public void consumePaymentEvent(@Payload String message,
                                    @Header(KafkaHeaders.RECEIVED_KEY) String key,
                                    @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                    @Header(KafkaHeaders.OFFSET) long offset,
                                    Acknowledgment ack) {
        try {
            PaymentEvent event = objectMapper.readValue(message, PaymentEvent.class);
            log.info("Received payment event: paymentId={}, orderId={}, status={}, amount={}, partition={}, offset={}",
                    event.getPaymentId(), event.getOrderId(), event.getStatus(), event.getAmount(), partition, offset);

            switch (event.getStatus()) {
                case SUCCESS -> handlePaymentSuccess(event);
                case FAILED -> handlePaymentFailure(event);
                case REFUNDED -> handlePaymentRefund(event);
                default -> log.warn("Unhandled payment status: {}", event.getStatus());
            }

            ack.acknowledge();
        } catch (Exception e) {
            log.error("Error processing payment event: key={}, message={}", key, message, e);
            ack.acknowledge();
        }
    }

    private void handlePaymentSuccess(PaymentEvent event) {
        try {
            Optional<Payment> existingPayment = paymentRepository.findByOrderId(event.getOrderId());
            if (existingPayment.isEmpty()) {
                Payment payment = Payment.builder()
                        .paymentId(event.getPaymentId() != null ? event.getPaymentId() : UUID.randomUUID())
                        .orderId(event.getOrderId())
                        .method(event.getMethod() != null ? event.getMethod() : "UNKNOWN")
                        .status("COMPLETED")
                        .transactionId(event.getTransactionId())
                        .amount(event.getAmount())
                        .timestamp(Instant.now())
                        .build();
                paymentRepository.save(payment);
                log.info("Payment record created: paymentId={}, orderId={}", payment.getPaymentId(), event.getOrderId());
            }

            Optional<Order> orderOpt = orderRepository.findById(event.getOrderId());
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                order.setStatus("PAID");
                order.setUpdatedAt(Instant.now());
                orderRepository.save(order);
                log.info("Order status updated to PAID: orderId={}", event.getOrderId());
            } else {
                log.warn("Order not found for payment success: orderId={}", event.getOrderId());
            }
        } catch (Exception e) {
            log.error("Failed to handle payment success for orderId={}", event.getOrderId(), e);
        }
    }

    private void handlePaymentFailure(PaymentEvent event) {
        try {
            Optional<Payment> existingPayment = paymentRepository.findByOrderId(event.getOrderId());
            if (existingPayment.isEmpty()) {
                Payment payment = Payment.builder()
                        .paymentId(event.getPaymentId() != null ? event.getPaymentId() : UUID.randomUUID())
                        .orderId(event.getOrderId())
                        .method(event.getMethod() != null ? event.getMethod() : "UNKNOWN")
                        .status("FAILED")
                        .transactionId(event.getTransactionId())
                        .amount(event.getAmount())
                        .timestamp(Instant.now())
                        .build();
                paymentRepository.save(payment);
                log.info("Failed payment record created: paymentId={}, orderId={}", payment.getPaymentId(), event.getOrderId());
            }

            Optional<Order> orderOpt = orderRepository.findById(event.getOrderId());
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                order.setStatus("PAYMENT_FAILED");
                order.setUpdatedAt(Instant.now());
                orderRepository.save(order);
                log.info("Order status updated to PAYMENT_FAILED: orderId={}", event.getOrderId());
            } else {
                log.warn("Order not found for payment failure: orderId={}", event.getOrderId());
            }
        } catch (Exception e) {
            log.error("Failed to handle payment failure for orderId={}", event.getOrderId(), e);
        }
    }

    private void handlePaymentRefund(PaymentEvent event) {
        try {
            Optional<Payment> paymentOpt = paymentRepository.findByOrderId(event.getOrderId());
            paymentOpt.ifPresent(payment -> {
                payment.setStatus("REFUNDED");
                paymentRepository.save(payment);
                log.info("Payment marked as REFUNDED: paymentId={}, orderId={}", payment.getPaymentId(), event.getOrderId());
            });

            Optional<Order> orderOpt = orderRepository.findById(event.getOrderId());
            if (orderOpt.isPresent()) {
                Order order = orderOpt.get();
                order.setStatus("REFUNDED");
                order.setUpdatedAt(Instant.now());
                orderRepository.save(order);
                log.info("Order status updated to REFUNDED: orderId={}", event.getOrderId());
            } else {
                log.warn("Order not found for refund: orderId={}", event.getOrderId());
            }
        } catch (Exception e) {
            log.error("Failed to handle payment refund for orderId={}", event.getOrderId(), e);
        }
    }
}
