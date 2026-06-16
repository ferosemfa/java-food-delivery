package com.fooddelivery.repository;

import com.fooddelivery.model.Payment;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends CassandraRepository<Payment, UUID> {

    Optional<Payment> findByOrderId(UUID orderId);

    Optional<Payment> findByTransactionId(String transactionId);

    java.util.List<Payment> findByStatus(String status);
}