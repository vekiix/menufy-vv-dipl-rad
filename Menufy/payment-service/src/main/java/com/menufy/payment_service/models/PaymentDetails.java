package com.menufy.payment_service.models;

import java.time.LocalDateTime;

public class PaymentDetails {
    private String paymentType;
    private final LocalDateTime processedAt = LocalDateTime.now();

}
