package com.menufy.order_service.dto;

import com.menufy.order_service.models.Item;

public class ItemChangeDto {
    public DataAction operation;
    public ItemDto item;

    public ItemChangeDto() {}

    public ItemChangeDto(DataAction _operation, Item _item) {
        this.operation = _operation;
        this.item = new ItemDto(_item.getId(), _item.getCompanyId(), _item.getName(), _item.getPrice());
    }
}
