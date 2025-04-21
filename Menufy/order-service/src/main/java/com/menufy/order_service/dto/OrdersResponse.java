package com.menufy.order_service.dto;

import com.menufy.order_service.models.Order;

import java.util.List;

public record OrdersResponse (List<Order> orders){
}
