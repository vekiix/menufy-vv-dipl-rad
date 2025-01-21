package com.menufy.menu_service.dto;

import com.menufy.menu_service.models.Item;

public record ItemRequest(String name, String description, String portion, float price, String currencyCode, byte[] image) {
}
