package com.menufy.auth_service.repository;

import com.menufy.auth_service.models.Company;
import com.menufy.auth_service.models.CompanyTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TableRepository extends JpaRepository<CompanyTable, String> {
    List<CompanyTable> findByCompanyId(String companyId);
}
