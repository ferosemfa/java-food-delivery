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
@Table("orders")
public class Order {

    @Id
    @PrimaryKeyColumn(name = "order_id", type = PrimaryKeyType.PARTITIONED)
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID orderId;

    @Column("customer_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID customerId;

    @Column("vendor_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID vendorId;

    @Column("items")
    @CassandraType(type = CassandraType.Name.LIST, typeArguments = CassandraType.Name.TEXT)
    private List<String> items;

    @Column("total_amount")
    @CassandraType(type = CassandraType.Name.DOUBLE)
    private Double totalAmount;

    @Column("status")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String status;

    @Column("delivery_address")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String deliveryAddress;

    @Column("delivery_latitude")
    @CassandraType(type = CassandraType.Name.DOUBLE)
    private Double deliveryLatitude;

    @Column("delivery_longitude")
    @CassandraType(type = CassandraType.Name.DOUBLE)
    private Double deliveryLongitude;

    @Column("created_at")
    @CassandraType(type = CassandraType.Name.TIMESTAMP)
    private Instant createdAt;

    @Column("updated_at")
    @CassandraType(type = CassandraType.Name.TIMESTAMP)
    private Instant updatedAt;
}
