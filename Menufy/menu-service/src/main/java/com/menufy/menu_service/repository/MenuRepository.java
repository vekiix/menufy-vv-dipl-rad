package com.menufy.menu_service.repository;

import com.menufy.menu_service.models.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, String> {
}
