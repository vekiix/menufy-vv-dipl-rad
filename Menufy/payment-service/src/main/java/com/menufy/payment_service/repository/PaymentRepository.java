package com.menufy.payment_service.repository;

import com.menufy.payment_service.models.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
}
