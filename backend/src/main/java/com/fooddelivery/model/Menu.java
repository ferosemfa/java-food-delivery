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
@Table("menu")
public class Menu {

    @Id
    @PrimaryKeyColumn(name = "menu_id", type = PrimaryKeyType.PARTITIONED)
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID menuId;

    @Column("vendor_id")
    @CassandraType(type = CassandraType.Name.UUID)
    private UUID vendorId;

    @Column("item_name")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String itemName;

    @Column("description")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String description;

    @Column("price")
    @CassandraType(type = CassandraType.Name.DOUBLE)
    private Double price;

    @Column("category")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String category;

    @Column("image_url")
    @CassandraType(type = CassandraType.Name.TEXT)
    private String imageUrl;

    @Column("is_available")
    @CassandraType(type = CassandraType.Name.BOOLEAN)
    private Boolean isAvailable;
}
