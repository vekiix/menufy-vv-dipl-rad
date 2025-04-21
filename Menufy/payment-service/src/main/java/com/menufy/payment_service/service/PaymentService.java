package com.menufy.payment_service.service;

import com.menufy.payment_service.dto.PaymentRequest;
import com.menufy.payment_service.models.Payment;
import com.menufy.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public Payment createPaymentTransaction(PaymentRequest paymentRequest) {
        Payment payment = Payment.initializePaymentFromPaymentRequest(paymentRequest);

        return paymentRepository.save(payment);
    }


}
