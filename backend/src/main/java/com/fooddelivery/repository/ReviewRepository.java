package com.fooddelivery.repository;

import com.fooddelivery.model.Review;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends CassandraRepository<Review, UUID> {

    List<Review> findByVendorId(UUID vendorId);

    List<Review> findByUserId(UUID userId);

    List<Review> findByOrderId(UUID orderId);
}