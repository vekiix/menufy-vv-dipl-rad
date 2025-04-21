package com.menufy.menu_service.dto;


public class ItemDto {
    public String id;
    public String name;
    public float price;

    public ItemDto(String _id, String _name, float _price)
    {
        this.id = _id;
        this.name = _name;
        this.price = _price;
    }
}
