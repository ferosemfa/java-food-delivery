package com.fooddelivery.repository;

import com.fooddelivery.model.Menu;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MenuRepository extends CassandraRepository<Menu, UUID> {

    List<Menu> findByVendorId(UUID vendorId);

    List<Menu> findByVendorIdAndCategory(UUID vendorId, String category);

    List<Menu> findByIsAvailable(Boolean isAvailable);

    List<Menu> findByVendorIdAndIsAvailable(UUID vendorId, Boolean isAvailable);
}