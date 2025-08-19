package com.menufy.menu_service.dto;


public class ItemDto {
    public String id;
    public String companyId;
    public String name;
    public float price;


    public ItemDto(String _id, String _companyId,String _name, float _price)
    {
        this.id = _id;
        this.companyId = _companyId;
        this.name = _name;
        this.price = _price;
    }
}
