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
@Table("order_items")
public class OrderItem {

    @Id
    @PrimaryKeyColumn(name = "item_id", type = PrimaryKeyType.PARTITIONED)
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID itemId;

    @Column("order_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID orderId;

    @Column("food_item_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID foodItemId;

    @Column("quantity")
    @CassandraType(type = CassandraType.Name.INT)
    private Integer quantity;

    @Column("price")
    @CassandraType(type = CassandraType.Name.DOUBLE)
    private Double price;
}
