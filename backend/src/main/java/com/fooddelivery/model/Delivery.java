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

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("deliveries")
public class Delivery {

    @Id
    @PrimaryKeyColumn(name = "delivery_id", type = PrimaryKeyType.PARTITIONED)
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID deliveryId;

    @Column("order_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID orderId;

    @Column("driver_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID driverId;

    @Column("status")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String status;

    @Column("current_location")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String currentLocation;

    @Column("estimated_time")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String estimatedTime;
}
