package com.fooddelivery.repository;

import com.fooddelivery.model.Delivery;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryRepository extends CassandraRepository<Delivery, UUID> {

    Optional<Delivery> findByOrderId(UUID orderId);

    java.util.List<Delivery> findByDriverId(UUID driverId);

    java.util.List<Delivery> findByStatus(String status);
}