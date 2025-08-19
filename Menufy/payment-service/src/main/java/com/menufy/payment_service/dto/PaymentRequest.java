package com.menufy.payment_service.dto;

public record PaymentRequest (String orderId,String companyId, float amount) {
}
