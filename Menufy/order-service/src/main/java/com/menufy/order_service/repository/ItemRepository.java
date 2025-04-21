package com.menufy.order_service.repository;


import com.menufy.order_service.models.Item;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ItemRepository extends MongoRepository<Item, String> {
}
