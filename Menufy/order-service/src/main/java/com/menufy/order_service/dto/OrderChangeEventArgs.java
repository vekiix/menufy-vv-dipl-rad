package com.menufy.order_service.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class OrderChangeEventArgs {
    public String orderId;
    public String companyId;
    public OrderStatus newOrderStatus;
}
