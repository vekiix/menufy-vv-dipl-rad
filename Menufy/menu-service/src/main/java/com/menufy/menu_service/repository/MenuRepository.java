package com.menufy.menu_service.repository;

import com.menufy.menu_service.models.Menu;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MenuRepository extends MongoRepository<Menu, String> {
}
