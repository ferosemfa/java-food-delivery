package com.fooddelivery.repository;

import com.fooddelivery.model.User;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends CassandraRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);

    @Query("SELECT * FROM users WHERE email = ?0 ALLOW FILTERING")
    Optional<User> findUserByEmail(String email);

    boolean existsByEmail(String email);
}
