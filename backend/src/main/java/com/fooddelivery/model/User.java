package com.fooddelivery.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.cassandra.core.cql.PrimaryKeyType;
import org.springframework.data.cassandra.core.mapping.CassandraType;
import org.springframework.data.cassandra.core.mapping.Column;
import org.springframework.data.cassandra.core.mapping.PrimaryKeyColumn;
import org.springframework.data.cassandra.core.mapping.Table;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("users")
public class User {

    @Id
    @PrimaryKeyColumn(name = "user_id", type = PrimaryKeyType.PARTITIONED)
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID userId;

    @Column("name")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String name;

    @Column("email")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String email;

    @Column("phone")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String phone;

    @Column("password_hash")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String passwordHash;

    @Column("location")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String location;

    @Column("role")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String role;

    @Column("created_at")
    @CassandraType(type = CassandraType.Name.TIMESTAMP)
    private Instant createdAt;
}
