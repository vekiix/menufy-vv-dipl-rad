package com.menufy.order_service.service;

import com.menufy.order_service.exceptions.ItemMissingException;
import com.menufy.order_service.models.Item;
import com.menufy.order_service.repository.ItemRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final MenuService menuService;

    public Item findItemById(String itemId){
        Optional<Item> item = itemRepository.findById(itemId);
        if(item.isPresent()){
            return item.get();
        }
        throw new ItemMissingException();
    }

    public Item findOrFetchItem(String itemId){
        Optional<Item> item = itemRepository.findById(itemId);
        if(item.isEmpty()){
            Item fetchedItem = menuService.fetchItemById(itemId);
            return itemRepository.save(fetchedItem);
        }

        return item.get();
    }
}
