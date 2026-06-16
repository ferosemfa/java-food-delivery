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
@Table("payments")
public class Payment {

    @Id
    @PrimaryKeyColumn(name = "payment_id", type = PrimaryKeyType.PARTITIONED)
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID paymentId;

    @Column("order_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID orderId;

    @Column("method")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String method;

    @Column("status")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String status;

    @Column("transaction_id")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String transactionId;

    @Column("amount")
    @CassandraType(type = CassandraType.Name.DOUBLE)
    private Double amount;

    @Column("timestamp")
    @CassandraType(type = CassandraType.Name.TIMESTAMP)
    private Instant timestamp;
}
