package com.fooddelivery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private long totalUsers;
    private long totalVendors;
    private long totalOrders;
    private long totalRevenue;
    private Map<String, Long> ordersByStatus;
    private Map<String, Double> revenueByPeriod;
    private Map<String, Long> topVendors;
    private Map<String, Long> popularItems;
}