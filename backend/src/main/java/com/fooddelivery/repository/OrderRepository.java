package com.fooddelivery.repository;

import com.fooddelivery.model.Order;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends CassandraRepository<Order, UUID> {

    List<Order> findByCustomerId(UUID customerId);

    List<Order> findByVendorId(UUID vendorId);

    List<Order> findByStatus(String status);
}