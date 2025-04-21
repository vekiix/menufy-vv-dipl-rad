package com.menufy.payment_service.models;

import com.menufy.payment_service.dto.PaymentRequest;
import com.menufy.payment_service.dto.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;
import org.springframework.security.core.parameters.P;

import java.time.LocalDateTime;


@AllArgsConstructor
@Builder
@Data
@Document(collection = "payments") // Marks this class as a MongoDB document
public class Payment {

    public Payment(){
        this.status = PaymentStatus.PENDING;
    }

    @MongoId(FieldType.OBJECT_ID)  // Changed from @Id
    private String id;

    private LocalDateTime createdAt = LocalDateTime.now();

    private float paymentAmount;

    private PaymentStatus status;

    @Indexed(unique=true)
    private String orderId;

    private PaymentDetails details;

    public static Payment initializePaymentFromPaymentRequest(PaymentRequest paymentRequest){
        Payment payment = new Payment();
        payment.paymentAmount = paymentRequest.price();
        payment.orderId = paymentRequest.orderId();

        return payment;
    };
}
