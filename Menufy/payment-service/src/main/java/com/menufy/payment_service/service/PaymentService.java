package com.menufy.payment_service.service;

import com.menufy.payment_service.dto.*;
import com.menufy.payment_service.models.*;
import com.menufy.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final CompanyService companyService;
    private final KafkaProducerService kafkaProducerService;

    public Payment findPaymentById(String transactionId){
        Optional<Payment> paymentOpt = paymentRepository.findById(transactionId);
        if(paymentOpt.isEmpty()){
            throw new RuntimeException("Payment with given ID doesn't exist");
        }
        return paymentOpt.get();
    }


    public Payment createPaymentTransaction(OrderDto order) {
        Payment payment = Payment.initializePaymentFromPaymentRequest(order);
        paymentRepository.save(payment);
        kafkaProducerService.sendPayment(payment);
        return payment;
    }


    public Payment processKeksPayPayment(String paymentId, KeksPayPaymentDetails paymentDetails){
        Payment payment = findPaymentById(paymentId);
        Company company = companyService.getCompanyInfo();
        payment.processOrderPayment(new KeksPayPayment(company.getKeksPayParameters(), paymentDetails));
        kafkaProducerService.sendPayment(payment);
        return paymentRepository.save(payment);
    }

    public Payment processWSPayPayment(String paymentId, WSPayPaymentDetails paymentDetails){
        WSPayParameters companyPaymentParameters = companyService.getCompanyInfo().getWsPayParameters();
        Payment payment = findPaymentById(paymentId);
        payment.processOrderPayment(new WSPayPayment(companyPaymentParameters, paymentDetails));
        kafkaProducerService.sendPayment(payment);
        return paymentRepository.save(payment);
    }
}
