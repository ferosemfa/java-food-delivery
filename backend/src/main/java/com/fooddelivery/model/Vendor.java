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
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("vendors")
public class Vendor {

    @Id
    @PrimaryKeyColumn(name = "vendor_id", type = PrimaryKeyType.PARTITIONED)
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID vendorId;

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

    @Column("address")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String address;

    @Column("rating")
    @CassandraType(type = CassandraType.Name.DOUBLE)
    private Double rating;

    @Column("menu_items")
    @CassandraType(type = CassandraType.Name.LIST, typeArguments = CassandraType.Name.TEXT)
    private List<String> menuItems;

    @Column("is_approved")
    @CassandraType(type = CassandraType.Name.BOOLEAN)
    private Boolean isApproved;

    @Column("created_at")
    @CassandraType(type = CassandraType.Name.TIMESTAMP)
    private Instant createdAt;
}
