package com.menufy.auth_service.repository;

import com.menufy.auth_service.models.Table;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<Table, String> {
}
