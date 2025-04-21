package com.menufy.auth_service.repository;

import com.menufy.auth_service.models.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, String> {
}
