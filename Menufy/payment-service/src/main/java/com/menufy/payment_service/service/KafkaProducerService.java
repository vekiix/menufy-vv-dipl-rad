package com.menufy.payment_service.service;


import com.menufy.payment_service.dto.PaymentDto;
import com.menufy.payment_service.models.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    @Value("${payment-service.kafka.payment-topic}")
    private String PAYMENT_TOPIC;

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendPayment(Payment payment) {
        kafkaTemplate.send(PAYMENT_TOPIC, new PaymentDto(payment).toString());
    }
}
