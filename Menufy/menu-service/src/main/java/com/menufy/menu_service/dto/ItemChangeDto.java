package com.menufy.menu_service.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.menufy.menu_service.models.Item;

public class ItemChangeDto {
    public DataAction operation;
    public ItemDto item;

    public ItemChangeDto(DataAction _operation, Item _item) {
        this.operation = _operation;
        this.item = new ItemDto(_item.getId(), _item.getCompanyId(),_item.getName(), _item.getPrice());
    }

    @Override
    public String toString()
    {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return ((ObjectWriter) ow).writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("There was a problem while parsing 'ItemChangeDto'");
        }
    }
}
