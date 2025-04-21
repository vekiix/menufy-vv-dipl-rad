package com.menufy.auth_service.repository;

import com.menufy.auth_service.models.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, String> {
    Optional<Company> findByOib(String oib);
}
