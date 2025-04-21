package com.menufy.payment_service.repository;

import com.menufy.payment_service.models.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRepository extends MongoRepository<Payment, String> {
}
