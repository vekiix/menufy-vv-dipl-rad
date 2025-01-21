package com.menufy.menu_service.controller;

import com.menufy.menu_service.dto.ItemRequest;
import com.menufy.menu_service.dto.ItemResponse;
import com.menufy.menu_service.dto.ItemsResponse;
import com.menufy.menu_service.models.Item;
import com.menufy.menu_service.services.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse createProduct(@RequestBody ItemRequest itemRequest) {
        return itemService.createItem(itemRequest);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ItemsResponse getAllItems() {
        return itemService.getAllItems();
    }

}
