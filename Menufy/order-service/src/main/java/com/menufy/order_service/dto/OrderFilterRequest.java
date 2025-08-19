package com.menufy.order_service.dto;

public record OrderFilterRequest(String orderId, String tableId, String status) {

}
