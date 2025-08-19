package com.menufy.order_service.dto;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class PaymentDto {
    public String orderId;
    public String transactionId;
    public PaymentStatus paymentStatus;

    public PaymentDto(){}
}
