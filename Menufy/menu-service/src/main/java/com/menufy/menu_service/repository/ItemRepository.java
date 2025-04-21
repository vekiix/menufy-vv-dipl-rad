package com.menufy.menu_service.repository;


import com.menufy.menu_service.models.Item;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ItemRepository extends MongoRepository<Item, String> {
    Item findById(long id);

}
