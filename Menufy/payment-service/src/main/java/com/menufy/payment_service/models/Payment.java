package com.menufy.payment_service.models;

import com.menufy.payment_service.dto.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.time.LocalDateTime;


@AllArgsConstructor
@Data
@Document(collection = "payment") // Marks this class as a MongoDB document
public class Payment {

    public Payment(){
    }

    @MongoId(FieldType.OBJECT_ID)
    private String id;

    private String companyId;

    private Object merchantTransaction;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime paidAt;

    private double paymentAmount;

    private PaymentStatus status  = PaymentStatus.PENDING;

    @Indexed(unique=true)
    private String orderId;

    private PaymentType paymentType;

    public static Payment initializePaymentFromPaymentRequest(OrderDto dto){
        Payment payment = new Payment();
        payment.setCompanyId(dto.companyId);
        payment.setPaymentAmount(dto.totalPrice);
        payment.setOrderId(dto.orderId);
        return payment;
    };

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        if(this.status == PaymentStatus.ACCEPTED){
            throw new RuntimeException("Payment already accepted");
        }
        this.status = paymentStatus;
    }

    public void processOrderPayment(Object payment) {
        if(payment instanceof KeksPayPayment){
            setPaymentType(PaymentType.KEKS_PAY);
        } else if (payment instanceof WSPayPayment) {
            setPaymentType(PaymentType.WS_PAY);
        }
        else throw new RuntimeException("Unidentified object used for processing payments");

        this.merchantTransaction = payment;
        this.setPaidAt(LocalDateTime.now());
        this.setPaymentStatus(PaymentStatus.ACCEPTED);
    }
}
