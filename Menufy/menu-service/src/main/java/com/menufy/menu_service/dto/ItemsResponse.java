package com.menufy.menu_service.dto;

import com.menufy.menu_service.models.Item;

import java.util.List;

public class ItemsResponse {
    private List<Item> items;

    public ItemsResponse(List<Item> items) {
        this.items = items;
    }

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }
}
