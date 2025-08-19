package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.BaseClaims;
import com.menufy.menu_service.dto.ItemRequest;
import com.menufy.menu_service.models.Company;
import com.menufy.menu_service.models.Item;
import com.menufy.menu_service.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemService {
    private final CompanyService companyService;
    private final ItemRepository itemRepository;

    public Item createItem(ItemRequest itemRequest) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Company company = companyService.findCompany(claims.getCompanyId());

        Item item = Item.builder()
                .name(itemRequest.name())
                .description(itemRequest.description())
                .portion(itemRequest.portion())
                .image(itemRequest.image())
                .price(itemRequest.price())
                .companyId(company.getId())
                .build();

        itemRepository.save(item);
        companyService.addItemToCompanyItemList(company, item);

        return item;
    }

    public List<Item> getAllItems() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return companyService.findCompany(claims.getCompanyId()).getItems();
    }

    public List<Item> deleteItem(String itemId) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Item item = companyService.findItemById(itemId, claims.getCompanyId());
        itemRepository.delete(item);
        return companyService.deleteItemFromCompanyItemList(item);
    }

    public Item updateItem(String itemId, ItemRequest itemRequest) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // This must return the correct Item object with the _id field populated!
        Item item = companyService.findItemById(itemId, claims.getCompanyId());

        if (item == null || item.getId() == null) {
            throw new IllegalArgumentException("Item not found or ID is missing");
        }

        log.info("Updating Item with id: {}", item.getId());

        item.setName(itemRequest.name());
        item.setDescription(itemRequest.description());
        item.setPortion(itemRequest.portion());
        item.setImage(itemRequest.image());
        item.setPrice(itemRequest.price());

        itemRepository.save(item);
        return item;
    }


    public Item findItemById(String id) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return companyService.findItemById(id, claims.getCompanyId());
    }
}

