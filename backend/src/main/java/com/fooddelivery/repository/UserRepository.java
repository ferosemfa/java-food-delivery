package com.fooddelivery.repository;

import com.fooddelivery.model.User;
import org.springframework.data.cassandra.repository.CassandraRepository;
import org.springframework.data.cassandra.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends CassandraRepository<User, UUID> {

    @Query("SELECT * FROM users WHERE email = ?0 ALLOW FILTERING")
    Optional<User> findByEmail(String email);

    @Query("SELECT * FROM users WHERE phone = ?0 ALLOW FILTERING")
    Optional<User> findByPhone(String phone);


}
