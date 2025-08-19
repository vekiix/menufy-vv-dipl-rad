package com.menufy.order_service.dto;


public class ItemDto {
    public String id;
    public String companyId;
    public String name;
    public float price;

    public ItemDto(){}

    public ItemDto(String _id, String _companyId, String _name, float _price)
    {
        this.companyId = _companyId;
        this.id = _id;
        this.name = _name;
        this.price = _price;
    }
}
