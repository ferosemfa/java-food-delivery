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
@Table("reviews")
public class Review {

    @Id
    @PrimaryKeyColumn(name = "review_id", type = PrimaryKeyType.PARTITIONED)
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID reviewId;

    @Column("user_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID userId;

    @Column("vendor_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID vendorId;

    @Column("order_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID orderId;

    @Column("rating")
    @CassandraType(type = CassandraType.Name.INT)
    private Integer rating;

    @Column("comment")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String comment;

    @Column("timestamp")
    @CassandraType(type = CassandraType.Name.TIMESTAMP)
    private Instant timestamp;
}
