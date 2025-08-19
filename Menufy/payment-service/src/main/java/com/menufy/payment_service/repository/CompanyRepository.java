package com.menufy.payment_service.repository;

import com.menufy.payment_service.models.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {
}
