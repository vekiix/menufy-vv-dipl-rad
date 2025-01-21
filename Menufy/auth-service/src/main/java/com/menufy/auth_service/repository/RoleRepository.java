package com.menufy.auth_service.repository;

import com.menufy.auth_service.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, String> {
}
