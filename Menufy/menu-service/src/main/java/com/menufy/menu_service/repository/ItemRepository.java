package com.menufy.menu_service.repository;


import com.menufy.menu_service.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, String> {
    Item findById(long id);

}
