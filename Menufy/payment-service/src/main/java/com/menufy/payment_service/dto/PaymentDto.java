package com.menufy.payment_service.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.menufy.payment_service.models.Payment;

public class PaymentDto {
    public String orderId;
    public String transactionId;
    public PaymentStatus paymentStatus;

    public PaymentDto(Payment payment) {
        this.orderId = payment.getOrderId();
        this.transactionId = payment.getId();
        this.paymentStatus = payment.getStatus();
    }

    @Override
    public String toString()
    {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return ((ObjectWriter) ow).writeValueAsString(this);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("There was a problem while parsing 'PaymentDto'");
        }
    }
}
