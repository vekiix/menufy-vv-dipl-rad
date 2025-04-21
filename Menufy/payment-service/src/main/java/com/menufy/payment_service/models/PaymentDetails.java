package com.menufy.payment_service.models;

import java.time.LocalDateTime;

public class PaymentDetails {
    private String paymentType;
    private String processingBank;
    private final LocalDateTime processedAt = LocalDateTime.now();

}
