package com.menufy.order_service.service;

import com.menufy.order_service.dto.ItemDto;
import com.menufy.order_service.exceptions.ItemMissingException;
import com.menufy.order_service.models.Item;
import com.menufy.order_service.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;
    private final CompanyService companyService;

    public Item findItemById(String itemId){
        Optional<Item> item = itemRepository.findById(itemId);
        if(item.isPresent()){
            return item.get();
        }
        throw new ItemMissingException();
    }

    public void createOrUpdate(ItemDto _itemDto) {
        Item item = itemRepository.findById(_itemDto.id)
                .orElseGet(Item::new);

        item.setId(_itemDto.id);
        item.setCompanyId(_itemDto.companyId);
        item.setName(_itemDto.name);
        item.setPrice(_itemDto.price);

        itemRepository.save(item);
        //companyService.addItemToCompanyItemList(item);
    }

    public void deleteItem(ItemDto _itemDto) {
        Item item = findItemById(_itemDto.id);
        //companyService.deleteItemFromCompanyItemList(item);
        itemRepository.delete(item);
    }
}
