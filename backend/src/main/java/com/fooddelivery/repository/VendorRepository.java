package com.fooddelivery.repository;

import com.fooddelivery.model.Vendor;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VendorRepository extends CassandraRepository<Vendor, UUID> {

    Optional<Vendor> findByEmail(String email);

    java.util.List<Vendor> findByIsApproved(Boolean isApproved);

    java.util.List<Vendor> findByNameContaining(String name);
}