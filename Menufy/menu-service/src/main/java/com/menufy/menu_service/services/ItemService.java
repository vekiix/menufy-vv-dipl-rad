package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.ItemRequest;
import com.menufy.menu_service.dto.ItemResponse;
import com.menufy.menu_service.dto.ItemsResponse;
import com.menufy.menu_service.models.Item;
import com.menufy.menu_service.repository.CurrencyRepository;
import com.menufy.menu_service.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemService {
    private final ItemRepository itemRepository;
    private final CurrencyRepository currencyRepository;

    public ItemResponse createItem(ItemRequest itemRequest) {
        Item item = Item.builder()
                .name(itemRequest.name())
                .description(itemRequest.description())
                .portion(itemRequest.portion())
                .image(itemRequest.image())
                .currency(currencyRepository.findByCurrencyCode(itemRequest.currencyCode()))
                .price(itemRequest.price())
                .build();

        itemRepository.save(item);

        return new ItemResponse(item);
    }

    public ItemsResponse getAllItems() {
        return new ItemsResponse(itemRepository.findAll());
    }

    public ItemsResponse getAllItemsForCompany() {
        return new ItemsResponse(itemRepository.findAll());
    }

}

