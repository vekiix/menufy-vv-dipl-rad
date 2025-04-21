package com.menufy.order_service.repository;


import com.menufy.order_service.models.Company;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CompanyRepository extends MongoRepository<Company, String> {
}
